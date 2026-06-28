import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ShopifyController } from './shopify.controller';
import { ShopModule } from '../shop/shop.module';
import { AppPricingModule } from '../app-pricing/app-pricing.module';

@Module({
  imports: [ShopModule, AppPricingModule],
  controllers: [ShopifyController],
  providers: [ShopifyService],
})
export class ShopifyModule {}
