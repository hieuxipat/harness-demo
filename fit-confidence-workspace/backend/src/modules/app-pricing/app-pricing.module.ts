import { Module } from '@nestjs/common';
import { AppPricingService } from './app-pricing.service';
import { AppPricingController } from './app-pricing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppPricingPlan } from './entities/app-pricing.entity';
import { DiscountAppliedHistory } from './entities/discount-applied-history.entity';
import { DiscountCode } from './entities/discount-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppPricingPlan, DiscountCode, DiscountAppliedHistory])],
  controllers: [AppPricingController],
  providers: [AppPricingService],
  exports: [AppPricingService],
})
export class AppPricingModule {}
