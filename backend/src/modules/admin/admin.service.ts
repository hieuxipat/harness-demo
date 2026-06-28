import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchUsersAdminDto } from './dto/admin.dto';
import { SearchUsersAdminResponse, UserInfoResponse, UserResponse } from './response/admin.response';
import { formatMetaResponse, formatPaginationRequest, isTestShop } from 'src/shared/utils/functions';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { ShopGeneral } from '../shop/entities/shop-general.entity';
import { ShopInfo } from '../shop/entities/shop-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopInstalled } from '../shop/entities/shop-installed.entity';
import { AdminDailyLog } from './entities/admin-daily-log.entity';
import { IUpdateDailyAnalytic } from './types/admin.interface';
import { UpdateReportAction } from './types/admin.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitterName } from 'src/shared/types/shared.enum';
import { IShopifyShopData } from '../shopify/types/shopify.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminDailyLog)
    private readonly adminDailyLogRepository: Repository<AdminDailyLog>,
    @InjectRepository(ShopInfo)
    private readonly shopInfoRepository: Repository<ShopInfo>,
    @InjectRepository(ShopGeneral)
    private readonly shopGeneralRepository: Repository<ShopGeneral>,
    @InjectRepository(ShopInstalled)
    private readonly shopInstalledRepository: Repository<ShopInstalled>,
  ) {}

  async getDateAnalytic(date: Date, activeUsers: ShopGeneral[]): Promise<AdminDailyLog> {
    const now = new Date(date);
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const logExist = await this.adminDailyLogRepository.findOne({
      where: { createdDate: new Date(year, month, day) },
    });
    const dailyLog = this.adminDailyLogRepository.create(logExist);
    if (!dailyLog.createdDate) dailyLog.createdDate = now;
    dailyLog.totalUser = activeUsers.length;
    return dailyLog;
  }

  async searchUsersAdmin(payload: SearchUsersAdminDto): Promise<SearchUsersAdminResponse> {
    const { search, page, perPage } = payload;
    const { skip, take } = formatPaginationRequest(page, perPage);
    const where: FindOptionsWhere<ShopGeneral> = {};
    let shopInfos: ShopInfo[];
    if (search) {
      if (search.includes('.myshopify')) where.shop = Like(`%${search.trim()}%`);
      else {
        shopInfos = await this.shopInfoRepository.find({
          where: [
            { name: Like(`%${search.trim()}%`) },
            { email: Like(`%${search.trim()}%`) },
            { phone: Like(`%${search.trim()}%`) },
            { shop: Like(`%${search.trim()}%`) },
          ],
        });
        const shopInfosName = shopInfos.map((shopInfo) => shopInfo.shop);
        where.shop = In(shopInfosName);
      }
    }
    const [shopGenerals, total] = await this.shopGeneralRepository.findAndCount({
      where,
      take,
      skip,
      order: { planUpdatedAt: 'DESC', id: 'DESC' },
    });
    const shopGeneralsName = shopGenerals.map(({ shop }) => shop);
    const shopsInstalled = await this.shopInstalledRepository.find({
      where: { shop: In(shopGeneralsName) },
    });
    if (!shopInfos) {
      shopInfos = await this.shopInfoRepository.find({
        where: { shop: In(shopGeneralsName) },
      });
    }
    const usersResponse: UserResponse[] = await Promise.all(
      shopGenerals.map(async (shopGeneral) => {
        const matchInstalled = shopsInstalled.find((shopInstall) => shopInstall.shop === shopGeneral.shop);
        const lastAccess = shopGeneral.lastAccess ? new Date(shopGeneral.lastAccess * 1000) : undefined;
        const firstInstallDate = matchInstalled ? new Date(matchInstalled.dateInstalled) : undefined;
        const lastInstallDate = matchInstalled ? new Date(matchInstalled.lastInstalledDate) : undefined;
        const isUninstall = !!matchInstalled?.uninstalled;
        const uninstalledDate = isUninstall && matchInstalled ? new Date(matchInstalled.dateUninstalled) : undefined;
        const matchShopInfo = shopInfos.find((shopInfo) => shopInfo.shop === shopGeneral.shop);
        const email = matchShopInfo?.email;
        const country = matchShopInfo?.country;
        const phone = matchShopInfo?.phone;
        let shopJson: IShopifyShopData;
        try {
          shopJson = JSON.parse(matchShopInfo.shopJson);
        } catch (err) {}
        const userResponse: UserResponse = {
          id: shopGeneral.id,
          shop: shopGeneral.shop,
          shopifyPlan: matchShopInfo.shopifyPlan,
          plan: shopGeneral.plan,
          subscription: shopGeneral.subscription,
          firstInstallDate,
          lastInstallDate,
          note: matchInstalled.note,
          isUninstall,
          uninstalledDate,
          otherUrl: shopJson?.domain,
          lastAccess,
          shopifyCreatedAt: shopJson?.created_at ? new Date(shopJson?.created_at) : undefined,
          contact: {
            email,
            country,
            phone,
          },
        };
        return userResponse;
      }),
    );
    return {
      statusCode: 200,
      data: usersResponse,
      meta: formatMetaResponse(page, perPage, total),
    };
  }

  async getUserInfo(id: number): Promise<UserInfoResponse> {
    const shopGeneral = await this.shopGeneralRepository.findOne({ where: { id } });
    if (!shopGeneral) throw new NotFoundException('Shop not found');
    const shopInfo = await this.shopInfoRepository.findOne({ where: { shop: shopGeneral.shop } });
    let shopJson: IShopifyShopData;
    try {
      shopJson = JSON.parse(shopInfo.shopJson);
    } catch (err) {}
    return {
      statusCode: 200,
      data: {
        shopGeneral,
        shopifyInfo: shopJson,
      },
    };
  }

  @OnEvent(EventEmitterName.ReportUpdate)
  async updateShopReport(payload: IUpdateDailyAnalytic) {
    const { date, shop, action } = payload;
    const shopInfo = await this.shopInfoRepository.findOne({ where: { shop } });
    if (isTestShop(shopInfo)) return;
    const reportDate = new Date(date);
    const year = reportDate.getFullYear();
    const month = reportDate.getMonth();
    const day = reportDate.getDate();
    const reportExist = await this.adminDailyLogRepository.findOne({
      where: { createdDate: new Date(year, month, day) },
    });
    const report = this.adminDailyLogRepository.create(reportExist);
    if (!report.createdDate) report.createdDate = reportDate;
    if (action === UpdateReportAction.INSTALL) {
      if (!report.installedUser) report.installedUser = 1;
      else report.installedUser += 1;
    } else if (action === UpdateReportAction.UNINSTALL) {
      if (!report.uninstalledUser) report.uninstalledUser = 1;
      else report.uninstalledUser += 1;
      const shopInstalled = await this.shopInstalledRepository.findOne({ where: { shop } });
      if (shopInstalled) {
        const installedTimestamp = new Date(shopInstalled.dateInstalled).getTime();
        const actionTimestamp = reportDate.getTime();
        if (actionTimestamp - installedTimestamp <= 24 * 60 * 60 * 1000) {
          if (!report.uninstallInDay) report.uninstallInDay = 1;
          else report.uninstallInDay += 1;
        }
      }
    }
    await this.adminDailyLogRepository.save(report);
  }
}
