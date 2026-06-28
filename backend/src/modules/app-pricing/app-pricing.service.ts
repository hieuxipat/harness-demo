import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppPricingPlan } from './entities/app-pricing.entity';
import { FindOptionsWhere, IsNull, LessThanOrEqual, Like, MoreThanOrEqual, Not, Or, Repository } from 'typeorm';
import {
  ApplyDiscountCodeDto,
  CreateAppPricingDto,
  CreateDiscountCodeDto,
  RemoveAppPricingDto,
  SearchDiscountCodeDto,
  SearchDiscountHistoryDto,
  UpdateAppPricingDto,
  UpdateDiscountCodeDto,
} from './dto/app-pricing.dto';
import { DefaultResponse } from 'src/docs/default/default-response.swagger';
import {
  AppPricingPlanResponse,
  GetShopDiscountCodeResponse,
  SearchDiscountCodeResponse,
  SearchDiscountHistoryResponse,
} from './response/app-pricing.response';
import { calculateYearlyPricingPlan, formatMetaResponse, formatPaginationRequest } from 'src/shared/utils/functions';
import { PlanSubscription, PricingPlan } from './types/app-pricing.enum';
import { DiscountCode } from './entities/discount-code.entity';
import { DiscountAppliedHistory } from './entities/discount-applied-history.entity';
import { DefaultAuthRequest } from 'src/docs/default/default-request.swagger';

@Injectable()
export class AppPricingService {
  constructor(
    @InjectRepository(AppPricingPlan)
    private readonly appPricingPlanRepository: Repository<AppPricingPlan>,
    @InjectRepository(DiscountCode)
    private readonly discountCodeRepository: Repository<DiscountCode>,
    @InjectRepository(DiscountAppliedHistory)
    private readonly discountAppliedHistoryRepository: Repository<DiscountAppliedHistory>,
  ) {}

  async getDefaultPlan(): Promise<AppPricingPlan> {
    return await this.appPricingPlanRepository.findOne({ where: { isDefault: true, isActive: true }, cache: true });
  }

  async createPricingPlan(payload: CreateAppPricingDto): Promise<DefaultResponse> {
    const { plan } = payload;
    const planExist = await this.appPricingPlanRepository.findOne({ where: { plan } });
    if (planExist) throw new BadRequestException('Plan already exists');
    const newPlan = this.appPricingPlanRepository.create(payload);
    if (!payload.annuallyMonthlyDisplayPrice) newPlan.annuallyMonthlyDisplayPrice = calculateYearlyPricingPlan(newPlan);
    if (!payload.annuallyPrice) newPlan.annuallyPrice = newPlan.annuallyMonthlyDisplayPrice * 12;
    if (payload.isDefault) await this.appPricingPlanRepository.update({ isDefault: true }, { isDefault: false });
    await this.appPricingPlanRepository.save(newPlan);
    return { statusCode: 200, message: 'success' };
  }

  async getAllPricingPlan(): Promise<AppPricingPlanResponse> {
    let plans = await this.appPricingPlanRepository.find({ where: { isActive: true }, order: { order: 'DESC' } });
    const defaultPlan = plans.find((plan) => plan.isDefault);
    if (defaultPlan && defaultPlan.plan !== PricingPlan.Free) {
      plans = plans.filter((plan) => plan.plan !== PricingPlan.Free);
    }
    return { statusCode: 200, message: 'success', data: plans };
  }

  async updateAppPricing(payload: UpdateAppPricingDto): Promise<DefaultResponse> {
    const { id, ...rest } = payload;
    const planExist = await this.appPricingPlanRepository.findOne({ where: { id } });
    if (!planExist) throw new BadRequestException('Plan not found');
    const newPlan = this.appPricingPlanRepository.create({ ...planExist, ...rest });
    newPlan.id = id;
    if (newPlan.plan !== PricingPlan.Free && (newPlan.price <= 0 || newPlan.annuallyPrice <= 0)) {
      throw new BadRequestException('Plan price must be greater than zero');
    }
    if (payload.isDefault) await this.appPricingPlanRepository.update({ isDefault: true }, { isDefault: false });
    await this.appPricingPlanRepository.save(newPlan);
    return { statusCode: 200 };
  }

  async removeAppPricing(payload: RemoveAppPricingDto): Promise<DefaultResponse> {
    const { id } = payload;
    const planExist = await this.appPricingPlanRepository.findOne({ where: { id } });
    if (!planExist) throw new BadRequestException('Plan not found');
    await this.appPricingPlanRepository.remove(planExist);
    return { statusCode: 200 };
  }

  async createDiscountCode(payload: CreateDiscountCodeDto): Promise<DefaultResponse> {
    const {
      startTime,
      expireTime,
      isActive,
      usagePerShop,
      trialDays,
      numberCycleApply,
      discountValue,
      plansApply,
      discountType,
    } = payload;
    const code = payload.code.trim().toUpperCase();
    const shopsApply = payload.shopsApply?.length ? payload.shopsApply.map((shop) => shop.trim().toLowerCase()) : null;
    try {
      const discountCode = this.discountCodeRepository.create({
        isActive,
        usagePerShop,
        trialDays,
        numberCycleApply,
        code,
        plansApply,
        shopsApply,
        discountValue,
        discountType,
      });
      if (startTime) discountCode.startTime = new Date(startTime);
      if (expireTime) discountCode.expireTime = new Date(expireTime);
      await this.discountCodeRepository.save(discountCode);
      return { statusCode: 200, message: `Code ${code} created` };
    } catch (err) {
      return { statusCode: 400, message: err.message };
    }
  }

  async updateDiscountCode(payload: UpdateDiscountCodeDto): Promise<DefaultResponse> {
    const { id, expireTime, isActive, startTime, usagePerShop } = payload;
    const discountCode = await this.discountCodeRepository.findOne({ where: { id } });
    if (!discountCode) throw new NotFoundException('Discount code not found');
    if (startTime) discountCode.startTime = new Date(startTime);
    if (expireTime) discountCode.expireTime = new Date(expireTime);
    if (payload.plansApply) {
      if (payload.plansApply.length) discountCode.plansApply = payload.plansApply;
      else discountCode.plansApply = null;
    }
    if (payload.shopsApply) {
      if (payload.shopsApply.length) discountCode.shopsApply = payload.shopsApply.map((shop) => shop.trim().toLowerCase());
      else discountCode.shopsApply = null;
    }
    if (isActive || isActive === false) discountCode.isActive = isActive;
    if (usagePerShop) discountCode.usagePerShop = usagePerShop;
    await this.discountCodeRepository.save(discountCode);
    return { statusCode: 200, message: 'Update code successfully' };
  }

  async searchDiscountCode(payload: SearchDiscountCodeDto): Promise<SearchDiscountCodeResponse> {
    const { code, isActive, page, perPage, activeCode } = payload;
    const { skip, take } = formatPaginationRequest(page, perPage);
    let where: FindOptionsWhere<DiscountCode> | FindOptionsWhere<DiscountCode>[] = {};
    if (code) where.code = Like(`%${code}%`);
    if (isActive || isActive === false) where.isActive = isActive;
    if (activeCode === true) {
      const now = new Date();
      where.isActive = true;
      where.startTime = Or(IsNull(), LessThanOrEqual(now));
      where.expireTime = Or(IsNull(), MoreThanOrEqual(now));
    } else if (activeCode === false) {
      const now = new Date();
      where = [
        { ...where, isActive: false },
        { ...where, startTime: MoreThanOrEqual(now) },
        { ...where, expireTime: LessThanOrEqual(now) },
      ];
    }
    const [discountCodes, total] = await this.discountCodeRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    const meta = formatMetaResponse(page, perPage, total);
    return {
      statusCode: 200,
      meta,
      data: discountCodes,
    };
  }

  async removeDiscountCode(id: number): Promise<DefaultResponse> {
    const discountCode = await this.discountCodeRepository.findOne({ where: { id } });
    if (!discountCode) throw new NotFoundException('Discount code not found');
    await this.discountCodeRepository.remove(discountCode);
    return { statusCode: 200, message: 'Remove code successfully' };
  }

  async searchDiscountHistory(payload: SearchDiscountHistoryDto): Promise<SearchDiscountHistoryResponse> {
    const { page, perPage, search, isApplied } = payload;
    const { skip, take } = formatPaginationRequest(page, perPage);
    let where: FindOptionsWhere<DiscountAppliedHistory> | FindOptionsWhere<DiscountAppliedHistory>[] = {};
    if (isApplied) where.paymentAt = Not(IsNull());
    if (search) {
      where = [
        { ...where, shop: Like(`%${payload.search}%`) },
        { ...where, discountCode: { code: Like(`%${payload.search}%`) } },
      ];
    }
    const [discountHistories, total] = await this.discountAppliedHistoryRepository.findAndCount({
      where,
      skip,
      take,
      order: { appliedAt: 'DESC' },
      relations: { discountCode: true },
    });
    const meta = formatMetaResponse(page, perPage, total);
    return {
      statusCode: 200,
      meta,
      data: discountHistories,
    };
  }

  async applyDiscountCode(payload: ApplyDiscountCodeDto): Promise<DefaultResponse> {
    const { discountCode, shop } = payload;
    const code = await this.discountCodeRepository.findOne({
      where: { code: Like(discountCode) },
      relations: { appliedHistory: true },
    });
    if (!code) throw new NotFoundException(`Code ${discountCode} not found`);
    const currentCodeApplied = code.appliedHistory?.find((history) => history.shop === shop && !history.paymentAt);
    if (currentCodeApplied) return { statusCode: 201, message: 'Code already applied' };
    const checkApplicable = this.checkCodeApplicable(shop, code);
    if (!checkApplicable.applicable) return { statusCode: 400, message: checkApplicable.msg };
    const currentApplyCode = await this.discountAppliedHistoryRepository.findOne({ where: { shop, paymentAt: IsNull() } });
    if (currentApplyCode) {
      currentApplyCode.appliedAt = new Date();
      currentApplyCode.discountCode = code;
      await this.discountAppliedHistoryRepository.save(currentApplyCode);
    } else {
      const applyCode = this.discountAppliedHistoryRepository.create({ discountCode: code, shop });
      await this.discountAppliedHistoryRepository.save(applyCode);
    }
    return { statusCode: 200, message: `Applying code successfully.` };
  }

  checkCodeApplicable(shop: string, discountCode: DiscountCode): { applicable: boolean; msg?: string } {
    if (!discountCode?.isActive) return { applicable: false, msg: 'Code not active' };
    const now = Date.now();
    const startTime = new Date(discountCode.startTime).getTime();
    const expireTime = new Date(discountCode.expireTime).getTime();
    if (startTime && startTime > now) return { applicable: false, msg: 'Code not start yet' };
    if (expireTime && expireTime < now) return { applicable: false, msg: 'Code expired' };
    if (discountCode.shopsApply && !discountCode.shopsApply.includes(shop)) {
      return { applicable: false, msg: 'Shop cannot applied' };
    }
    if (discountCode.usageLimit) {
      const countTotalUsage = discountCode.appliedHistory?.length || 0;
      if (countTotalUsage >= discountCode.usageLimit) return { applicable: false, msg: 'Limit usage reached' };
    }
    if (discountCode.usagePerShop) {
      const countShopUsage = discountCode.appliedHistory?.filter((history) => history.shop === shop)?.length || 0;
      if (countShopUsage >= discountCode.usagePerShop) return { applicable: false, msg: 'Limit usage reached' };
    }
    return { applicable: true };
  }

  async currentAppliedCode(shop: string, plan?: PricingPlan, subscription?: PlanSubscription): Promise<DiscountCode | false> {
    const appliedHistory = await this.discountAppliedHistoryRepository.findOne({
      where: { shop, paymentAt: IsNull() },
      relations: { discountCode: true },
    });
    if (!appliedHistory?.discountCode) return false;
    const checkApplicable = this.checkCodeApplicable(shop, appliedHistory.discountCode);
    if (checkApplicable.applicable) {
      const { plansApply, cycleApply } = appliedHistory.discountCode;
      if (plan && plansApply && !plansApply.includes(plan)) return false;
      if (subscription && cycleApply && cycleApply !== subscription) return false;
      return appliedHistory.discountCode;
    }
    //Remove applied history if code not aplicable for shop (ignore if not aplicable by plan and súccription)
    if (appliedHistory) await this.discountAppliedHistoryRepository.remove(appliedHistory);
    return false;
  }

  async getShopDiscount(payload: DefaultAuthRequest): Promise<GetShopDiscountCodeResponse> {
    const discountCode = await this.currentAppliedCode(payload.shop);
    if (discountCode) {
      return {
        statusCode: 200,
        data: { code: discountCode.code, discountValue: discountCode.discountValue, discountType: discountCode.discountType },
      };
    }
    return { statusCode: 200, message: 'Shop not applied discount' };
  }

  async removeShopDiscount(payload: DefaultAuthRequest): Promise<DefaultResponse> {
    const appliedHistory = await this.discountAppliedHistoryRepository.findOne({
      where: { shop: payload.shop, paymentAt: IsNull() },
      relations: { discountCode: true },
    });
    if (!appliedHistory) return { statusCode: 404, message: 'Shop not applied discount' };
    await this.discountAppliedHistoryRepository.remove(appliedHistory);
    return { statusCode: 200, message: 'Applied discount removed' };
  }

  async updateDiscountHistory(
    query: FindOptionsWhere<DiscountAppliedHistory>,
    payload: Partial<DiscountAppliedHistory>,
  ): Promise<void> {
    await this.discountAppliedHistoryRepository.update(query, payload);
  }
}
