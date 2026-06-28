import { IsOptional } from 'class-validator';
import { PlanSubscription, PricingPlan } from 'src/modules/app-pricing/types/app-pricing.enum';

export class ShopifyAppDto {
  @IsOptional()
  hmac?: string;

  @IsOptional()
  host?: string;

  @IsOptional()
  shop?: string;

  @IsOptional()
  timestamp?: string;

  @IsOptional()
  embedded?: string;

  @IsOptional()
  locale?: string;

  @IsOptional()
  id_token?: string;
}

export class HandleShopifyChargeDto {
  @IsOptional()
  charge_id?: string;

  shop: string;

  @IsOptional()
  plan?: PricingPlan;

  @IsOptional()
  subscription?: PlanSubscription;
}
