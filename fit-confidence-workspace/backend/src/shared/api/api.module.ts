import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { SampleApiService } from './services/sample-api.service';
import { ShopInfo } from 'src/modules/shop/entities/shop-info.entity';
import { ShopInstalled } from 'src/modules/shop/entities/shop-installed.entity';
import { AppPricingPlan } from 'src/modules/app-pricing/entities/app-pricing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopifyGraphQLService } from './services/shopify-graphql.service';
import { AppPricingModule } from 'src/modules/app-pricing/app-pricing.module';
import { ShopGeneral } from 'src/modules/shop/entities/shop-general.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopInfo, ShopInstalled, ShopGeneral, AppPricingPlan]), AppPricingModule],
  providers: [ApiService, SampleApiService, ShopifyGraphQLService],
  exports: [ApiService, SampleApiService, ShopifyGraphQLService],
})
export class ApiModule {}
