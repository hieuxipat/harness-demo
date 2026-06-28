import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { AppPricingService } from './app-pricing.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { AppAuth } from 'src/shared/auth/decorators/auth.decorator';
import { DefaultAuthRequest } from 'src/docs/default/default-request.swagger';

@Controller('app-pricing')
@ApiTags('App Pricing')
export class AppPricingController {
  constructor(private readonly appPricingService: AppPricingService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create app pricing' })
  @ApiOkResponse({ type: DefaultResponse })
  createAppPricing(@Body() body: CreateAppPricingDto) {
    return this.appPricingService.createPricingPlan(body);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update app pricing' })
  @ApiOkResponse({ type: DefaultResponse })
  updateAppPricing(@Body() body: UpdateAppPricingDto) {
    return this.appPricingService.updateAppPricing(body);
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove app pricing' })
  @ApiOkResponse({ type: DefaultResponse })
  removeAppPricing(@Body() body: RemoveAppPricingDto) {
    return this.appPricingService.removeAppPricing(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get app pricings' })
  @ApiOkResponse({ type: AppPricingPlanResponse })
  getAppPricings() {
    return this.appPricingService.getAllPricingPlan();
  }

  @Post('discount-code/create')
  @ApiOperation({ summary: 'Create discount code API' })
  @ApiOkResponse({ type: DefaultResponse })
  createDiscountCode(@Body() body: CreateDiscountCodeDto) {
    return this.appPricingService.createDiscountCode(body);
  }

  @Put('discount-code/update')
  @ApiOkResponse({ type: DefaultResponse, description: 'Update code response' })
  updateDiscountCode(@Body() body: UpdateDiscountCodeDto) {
    return this.appPricingService.updateDiscountCode(body);
  }

  @Get('discount-code/search')
  @ApiOkResponse({ type: SearchDiscountCodeResponse, description: 'DiscountCode response' })
  searchDiscountCode(@Query() query: SearchDiscountCodeDto) {
    return this.appPricingService.searchDiscountCode(query);
  }

  @Delete('discount-code/remove')
  @ApiOkResponse({ type: DefaultResponse, description: 'Remove discount code response' })
  removeDiscountCode(@Query('id') id: string) {
    return this.appPricingService.removeDiscountCode(Number(id));
  }

  @Get('history/search')
  @ApiOkResponse({ type: SearchDiscountHistoryResponse, description: 'Discount history response' })
  searchDiscountHistory(@Query() query: SearchDiscountHistoryDto) {
    return this.appPricingService.searchDiscountHistory(query);
  }

  @Put('apply-code')
  @AppAuth()
  @ApiOperation({ summary: 'API apply discount code (applyDiscountCode)' })
  @ApiOkResponse({ type: DefaultResponse, description: 'Return state and message(msg)' })
  applyDiscountCode(@Body() body: ApplyDiscountCodeDto) {
    return this.appPricingService.applyDiscountCode(body);
  }

  @Get('shop-discount')
  @AppAuth()
  @ApiOperation({ summary: 'Get shop current applied discount code' })
  @ApiOkResponse({ type: GetShopDiscountCodeResponse })
  getShopDiscount(@Query() query: DefaultAuthRequest) {
    return this.appPricingService.getShopDiscount(query);
  }

  @Delete('remove-discount')
  @AppAuth()
  @ApiOperation({ summary: 'Remove shop appliedDiscount' })
  @ApiOkResponse({ type: DefaultResponse })
  removeShopDiscount(@Query() query: DefaultAuthRequest) {
    return this.appPricingService.removeShopDiscount(query);
  }
}
