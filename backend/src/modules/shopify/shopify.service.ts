import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HandleShopifyChargeDto, ShopifyAppDto } from './dto/shopify.dto';
import { objectToQuerystring } from 'src/shared/utils/functions';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventEmitterName } from 'src/shared/types/shared.enum';
import { ShopService } from '../shop/shop.service';
import { PlanSubscription, PricingPlan } from '../app-pricing/types/app-pricing.enum';
import { AppPricingService } from '../app-pricing/app-pricing.service';
import { IAppInstallEventPayload } from './types/shopify.interface';
import { DefaultAuthRequest } from 'src/docs/default/default-request.swagger';
import { UpdateReportAction } from '../admin/types/admin.enum';
import { ShopifyGraphQLService } from 'src/shared/api/services/shopify-graphql.service';
import { AppSubscriptionStatus } from 'src/shared/api/types/graphql-api/admin.types';

@Injectable()
export class ShopifyService {
  constructor(
    private readonly shopifyGraphQLService: ShopifyGraphQLService,
    private readonly shopService: ShopService,
    private readonly appPricingService: AppPricingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handleGetTokenAndRedirect(shopifyPayload: ShopifyAppDto): Promise<{ url: string }> {
    const { shop, id_token } = shopifyPayload;
    const shopInfo = await this.shopService.findOneShopInfo({ where: { shop } });
    let isAccessTokenValid = false;
    const isAppInstalled = !!id_token;
    if (shopInfo) {
      const shopInstalled = await this.shopService.findOneShopInstalled({ where: { shop } });
      if (shopInstalled && !shopInstalled.uninstalled) isAccessTokenValid = true;
      if (shopInstalled?.closeStore) await this.shopService.updateShopInstall({ shop }, { closeStore: false });
    }
    if (!isAppInstalled && !isAccessTokenValid) throw new UnauthorizedException('Token not found');
    if (isAppInstalled && !isAccessTokenValid) {
      const shopifyToken = await this.shopifyGraphQLService.getOfflineShopifyToken(shop, id_token);
      const getShopDetail = await this.shopifyGraphQLService.queryShopSetting({ accessToken: shopifyToken.accessToken, shop });
      const createShopEventPayload: IAppInstallEventPayload = {
        shop,
        accessToken: shopifyToken.accessToken,
        shopifyShopDetail: getShopDetail.shop,
      };
      await this.eventEmitter.emitAsync(EventEmitterName.AppInstall, createShopEventPayload);
      this.eventEmitter.emit(EventEmitterName.ReportUpdate, { shop, date: new Date(), action: UpdateReportAction.INSTALL });
    }
    const shopGeneral = await this.shopService.findOneShopGeneral({ where: { shop } });
    if (shopGeneral?.plan === PricingPlan.Free) {
      const defaultPlan = await this.appPricingService.getDefaultPlan();
      if (defaultPlan && defaultPlan.plan !== PricingPlan.Free) {
        const getConfirmationUrl = await this.shopifyGraphQLService.mutateShopifyChargeUrl(shop, defaultPlan.plan);
        const confirmationUrl = getConfirmationUrl.confirmationUrl;
        return { url: confirmationUrl };
      }
    }
    const params = objectToQuerystring(shopifyPayload);
    if (shopGeneral?.displayOnboarding) return { url: `${process.env.APP_UI_DOMAIN}/onboarding?${params}` };
    return { url: `${process.env.APP_UI_DOMAIN}/home?${params}` };
  }

  async getShopMetafield(payload: DefaultAuthRequest) {
    const shopMetafield = await this.shopifyGraphQLService.queryAppInstallationMetafields({ shop: payload.shop });
    return shopMetafield;
  }

  async handleShopifyCharge(payload: HandleShopifyChargeDto) {
    const { charge_id, shop, plan = PricingPlan.Free, subscription = PlanSubscription.Monthly } = payload;
    if (!charge_id) return;
    const currentActiveCharges = await this.shopifyGraphQLService.queryCurrentActiveCharges({ shop });
    const currentCharge = currentActiveCharges?.find((charge) => charge.id.endsWith(charge_id));
    if (currentCharge?.status === AppSubscriptionStatus.Active) {
      await this.eventEmitter.emitAsync(EventEmitterName.PlanPurchase, { shop, plan, subscription });
      this.eventEmitter.emit(EventEmitterName.ReportUpdate, { shop, date: new Date(), action: UpdateReportAction.UPGRADE });
    }
    return { url: `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}` };
  }

  async test() {
    return;
  }
}
