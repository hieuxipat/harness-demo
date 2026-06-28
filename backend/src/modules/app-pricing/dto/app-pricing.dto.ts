import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { DiscountType, PricingPlan, PricingTag } from '../types/app-pricing.enum';
import { OmitType, PartialType } from '@nestjs/swagger';
import { DefaultAuthRequest, DefaultPaginationRequest } from 'src/docs/default/default-request.swagger';
import { Transform } from 'class-transformer';

export class CreateAppPricingDto {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsEnum(PricingPlan)
  plan: PricingPlan;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  annuallyDiscount?: number;

  @IsOptional()
  @IsNumber()
  annuallyMonthlyDisplayPrice?: number;

  @IsOptional()
  @IsNumber()
  annuallyPrice?: number;

  @IsOptional()
  @IsNumber()
  trialDays?: number;

  @IsOptional()
  @IsEnum(PricingTag)
  tag?: PricingTag;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  monthlyDescription?: string;

  @IsOptional()
  @IsString()
  annuallyDescription?: string;
}

export class UpdateAppPricingDto extends PartialType(OmitType(CreateAppPricingDto, ['plan'])) {
  @IsNumber()
  id: number;
}

export class RemoveAppPricingDto extends DefaultAuthRequest {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id: number;
}

export class CreateDiscountCodeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  trialDays?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  expireTime?: Date;

  @IsNumber()
  @IsPositive()
  discountValue: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberCycleApply?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(PricingPlan, { each: true })
  plansApply?: PricingPlan[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  shopsApply?: string[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  usagePerShop?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;
}

export class UpdateDiscountCodeDto extends OmitType(CreateDiscountCodeDto, ['code', 'discountValue']) {
  @IsNumber()
  id: number;
}

export class SearchDiscountCodeDto extends DefaultPaginationRequest {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @Transform(({ value }) => [true, 'true'].includes(value))
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => [true, 'true'].includes(value))
  @IsBoolean()
  activeCode?: boolean;
}

export class SearchDiscountHistoryDto extends DefaultPaginationRequest {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => [true, 'true'].includes(value))
  @IsBoolean()
  isApplied?: boolean;
}

export class ApplyDiscountCodeDto extends DefaultAuthRequest {
  @IsString()
  @IsNotEmpty()
  discountCode: string;
}
