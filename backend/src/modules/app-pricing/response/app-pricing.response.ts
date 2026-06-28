import { AppPricingPlan } from '../entities/app-pricing.entity';
import { DefaultPaginationResponse, DefaultResponse } from 'src/docs/default/default-response.swagger';
import { DiscountCode } from '../entities/discount-code.entity';
import { DiscountAppliedHistory } from '../entities/discount-applied-history.entity';
import { PickType } from '@nestjs/swagger';

export class AppPricingPlanResponse extends DefaultResponse {
  data: AppPricingPlan[];
}

export class SearchDiscountCodeResponse extends DefaultPaginationResponse {
  data: DiscountCode[];
}

export class SearchDiscountHistoryResponse extends DefaultPaginationResponse {
  data: DiscountAppliedHistory[];
}

export class GetShopDiscountCodeResponse extends DefaultResponse {
  data?: ShopDiscountData;
}

export class ShopDiscountData extends PickType(DiscountCode, ['code', 'discountType', 'discountValue']) {}
