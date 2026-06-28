import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopGeneral } from './entities/shop-general.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ShopInfo } from './entities/shop-info.entity';
import { ShopInstalled } from './entities/shop-installed.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventEmitterName } from 'src/shared/types/shared.enum';
import { objectToQuerystring, unixTimestamp } from 'src/shared/utils/functions';
import { DefaultAuthRequest } from 'src/docs/default/default-request.swagger';
import {
  CrispData,
  GetChargeUrlResponse,
  ShopCrispDataResponse,
  ShopGeneralSettingResponse,
  UpdateShopGeneralSettingResponse,
} from './response/shop.response';
import { IAppInstallEventPayload, IShopifyShopData } from '../shopify/types/shopify.interface';
import { PlanSubscription, PricingPlan } from '../app-pricing/types/app-pricing.enum';
import { GetChargeUrlDto, UpdateGeneralSettingDto } from './dto/shop.dto';
import { IShopUpdateEvent } from './types/shop.interface';
import { ShopifyGraphQLService } from 'src/shared/api/services/shopify-graphql.service';

@Injectable()
export class ShopService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly shopifyGraphQLService: ShopifyGraphQLService,
    @InjectRepository(ShopGeneral)
    private readonly shopGeneralRepository: Repository<ShopGeneral>,
    @InjectRepository(ShopInfo)
    private readonly shopInfoRepository: Repository<ShopInfo>,
    @InjectRepository(ShopInstalled)
    private readonly shopInstalledRepository: Repository<ShopInstalled>,
  ) {}

  async getShopGeneral(payload: DefaultAuthRequest, user: Record<string, any>): Promise<ShopGeneralSettingResponse> {
    const { shop } = payload;
    const shopGeneral = await this.shopGeneralRepository.findOne({ where: { shop } });
    if (user?.hmac) this.shopGeneralRepository.update({ shop }, { lastAccess: unixTimestamp() });
    return { statusCode: 200, data: shopGeneral, message: 'success' };
  }

  async updateShopGeneral(payload: UpdateGeneralSettingDto): Promise<UpdateShopGeneralSettingResponse> {
    const { shop } = payload;
    const shopGeneral = await this.shopGeneralRepository.findOne({ where: { shop } });
    if (!shopGeneral) throw new NotFoundException('Shop general not found');
    const updateShopGeneral = this.shopGeneralRepository.create({ id: shopGeneral?.id, shop });
    const updatedData = await this.shopGeneralRepository.save(updateShopGeneral);
    return { statusCode: 200, data: updatedData, message: 'success' };
  }

  async findOneShopGeneral(options: FindOneOptions<ShopGeneral>): Promise<ShopGeneral> {
    return await this.shopGeneralRepository.findOne(options);
  }

  async findOneShopInstalled(options: FindOneOptions<ShopInstalled>): Promise<ShopInstalled> {
    return await this.shopInstalledRepository.findOne(options);
  }

  async findShopInstalled(options: FindManyOptions<ShopInstalled>): Promise<ShopInstalled[]> {
    return await this.shopInstalledRepository.find(options);
  }

  async findOneShopInfo(options: FindOneOptions<ShopInfo>): Promise<ShopInfo> {
    return await this.shopInfoRepository.findOne(options);
  }

  async updateShopInstall(query: FindOptionsWhere<ShopInstalled>, payload: Partial<ShopInstalled>): Promise<void> {
    await this.shopInstalledRepository.update(query, payload);
  }

  async getChargeUrl(payload: GetChargeUrlDto): Promise<GetChargeUrlResponse> {
    const { shop, plan, subscription } = payload;
    const shopGeneral = await this.shopGeneralRepository.findOne({ where: { shop } });
    if (!shopGeneral) throw new NotFoundException('Shop not found');
    if (plan === PricingPlan.Free) {
      if (shopGeneral.plan === PricingPlan.Free) throw new BadRequestException('Shop already in free plan');
      await this.shopifyGraphQLService.cancelAllChargePlan(shop);
      await this.eventEmitter.emitAsync(EventEmitterName.PlanPurchase, { shop, plan, subscription, oldPlan: shopGeneral?.plan });
      return { statusCode: 200, message: 'Change plan success fully' };
    }
    const { confirmationUrl } = await this.shopifyGraphQLService.mutateShopifyChargeUrl(shop, plan, subscription);
    return { statusCode: 200, data: { url: confirmationUrl } };
  }

  async getShopCrispData(shop: string): Promise<ShopCrispDataResponse> {
    if (!shop) return;
    const shopInfo = await this.shopInfoRepository.findOne({ where: { shop }, cache: true });

    let shopData: IShopifyShopData;
    try {
      shopData = JSON.parse(shopInfo?.shopJson);
    } catch (err) {
      console.log(shop, shopInfo?.shopJson);
    }
    if (!shopData) return { statusCode: 404, message: 'Shop data not found' };
    const shopInstalled = await this.shopInstalledRepository.findOne({ where: { shop }, cache: 5 * 1000 });
    const shopGeneral = await this.shopGeneralRepository.findOne({ where: { shop }, cache: true });
    const reviewHistoryQuery = {
      nameReviewer: shopData?.name,
      reviewer_location: shopData?.country_name,
    };
    const crispData: CrispData = {
      appName: '',
      country: shopData?.country_name || shopInfo.country,
      emailShop: shopData?.email || shopInfo.email,
      firstInstalledDate: shopInstalled?.dateInstalled,
      lastInstalledDate: shopInstalled?.lastInstalledDate,
      phone: shopData?.phone || shopInfo.phone,
      shopifyPlan: shopData?.plan_name || shopInfo.shopifyPlan,
      timezone: shopData?.timezone || shopInfo.timezone,
      city: shopData.city || shopInfo.city,
      nameShop: shopData.name || shopInfo.name,
      uninstalledDate: shopInstalled?.dateUninstalled,
      plan: shopGeneral?.plan,
      reviewHistory: `https://letsmetrix.com/dashboard/review?${objectToQuerystring(reviewHistoryQuery)}`,
    };
    return { statusCode: 200, data: crispData };
  }

  @OnEvent(EventEmitterName.ShopUpdate)
  async handleShopUpdateEvent({ shop, payload }: IShopUpdateEvent) {
    const { plan_name, plan_display_name, country_name, city, zip, iana_timezone, email, phone, name, domain } = payload;
    const updateShopInstalled: Partial<ShopInstalled> = { closeStore: false };
    const updateShopInfo: Partial<ShopInfo> = {
      email,
      phone,
      name,
      country: country_name,
      timezone: iana_timezone,
      city,
      shopifyPlan: plan_name,
      zipcode: zip,
      shopJson: JSON.stringify(payload),
      otherDomain: domain,
    };
    if (['frozen', 'cancelled'].includes(plan_name) || plan_display_name === 'cancelled') updateShopInstalled.closeStore = true;
    await this.shopInstalledRepository.update({ shop }, updateShopInstalled);
    await this.shopInfoRepository.update({ shop }, updateShopInfo);
  }

  @OnEvent(EventEmitterName.AppUninstall)
  async handleAppUninstalledEvent({ shop }: { shop: string }) {
    const updateShopInstalled: Partial<ShopInstalled> = {
      uninstalled: true,
      dateUninstalled: new Date(),
    };
    try {
      await this.shopInstalledRepository.update({ shop }, updateShopInstalled);
    } catch (err) {
      console.log(err);
    }
    try {
      await this.shopGeneralRepository.update({ shop }, { planUpdatedAt: unixTimestamp() });
    } catch (err) {
      console.log(err);
    }
  }

  @OnEvent(EventEmitterName.AppInstall)
  async createShopInfo(payload: IAppInstallEventPayload): Promise<void> {
    const { shop, accessToken, shopifyShopDetail } = payload;
    const shopInfoExist = await this.shopInfoRepository.findOne({ where: { shop } });
    const shopInfo = this.shopInfoRepository.create({
      accessToken,
      shop,
      city: shopifyShopDetail?.billingAddress?.city,
      country: shopifyShopDetail?.billingAddress?.country,
      email: shopifyShopDetail.email,
      name: shopifyShopDetail.name,
      phone: shopifyShopDetail?.billingAddress?.phone,
      shopifyPlan: shopifyShopDetail?.plan?.displayName,
      timezone: shopifyShopDetail?.ianaTimezone,
      zipcode: shopifyShopDetail?.billingAddress?.zip,
      shopJson: JSON.stringify(shopifyShopDetail),
      id: shopInfoExist?.id,
      otherDomain: shopifyShopDetail?.primaryDomain?.host,
    });
    await this.shopInfoRepository.save(shopInfo);
  }

  @OnEvent(EventEmitterName.AppInstall)
  async createShopGeneral(payload: IAppInstallEventPayload): Promise<void> {
    const { shop } = payload;
    const shopGeneralExist = await this.shopGeneralRepository.findOne({ where: { shop } });
    await this.shopGeneralRepository.save({
      plan: PricingPlan.Free,
      planUpdatedAt: unixTimestamp(),
      shop,
      id: shopGeneralExist?.id,
    });
  }

  @OnEvent(EventEmitterName.AppInstall)
  async createShopInstalled(payload: IAppInstallEventPayload): Promise<void> {
    const { shop } = payload;
    const shopInstalledExist = await this.shopInstalledRepository.findOne({ where: { shop } });
    if (shopInstalledExist) {
      await this.shopInstalledRepository.update(
        { shop },
        { lastInstalledDate: new Date(), uninstalled: false, closeStore: false },
      );
    } else await this.shopInstalledRepository.save({ shop });
  }

  @OnEvent(EventEmitterName.PlanPurchase)
  async changeShopPlan(payload: { shop: string; plan: PricingPlan; subscription: PlanSubscription }): Promise<void> {
    const { shop, plan, subscription } = payload;
    await this.shopGeneralRepository.update({ shop }, { plan, subscription, planUpdatedAt: unixTimestamp() });
  }
}
