import { IsEnum } from 'class-validator';
import { DefaultAuthRequest } from 'src/docs/default/default-request.swagger';
import { PlanSubscription, PricingPlan } from 'src/modules/app-pricing/types/app-pricing.enum';

export class UpdateGeneralSettingDto extends DefaultAuthRequest {}

export class GetChargeUrlDto extends DefaultAuthRequest {
  @IsEnum(PricingPlan)
  plan: PricingPlan;

  @IsEnum(PlanSubscription)
  subscription: PlanSubscription;
}
