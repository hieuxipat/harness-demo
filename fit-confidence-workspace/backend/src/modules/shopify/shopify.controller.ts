import { Controller, Get, Query, Redirect, UseGuards } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedResponse } from 'src/docs/default/default-response.swagger';
import { ShopifyAuthGuard } from 'src/shared/auth/guards/shopify-auth.guard';
import { HandleShopifyChargeDto, ShopifyAppDto } from './dto/shopify.dto';
import { DefaultAuthRequest } from 'src/docs/default/default-request.swagger';

@Controller('shopify')
@ApiTags('Shopify')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Get('app')
  @ApiOperation({ summary: 'Redirect user to install app or homepage' })
  @ApiOkResponse({ description: 'Redirect user to install page or app page' })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: 'Validate request failed' })
  @UseGuards(ShopifyAuthGuard)
  @Redirect()
  handleRedirectApp(@Query() query: ShopifyAppDto) {
    return this.shopifyService.handleGetTokenAndRedirect(query);
  }

  @Get('charge')
  @ApiOperation({ summary: 'Handle shopify callback charge event' })
  @ApiOkResponse({ description: 'Redirect user to app page' })
  @Redirect()
  handleShopifyCharge(@Query() query: HandleShopifyChargeDto) {
    return this.shopifyService.handleShopifyCharge(query);
  }

  @Get('shop-metafield')
  @ApiOperation({ summary: 'Get shopify shop metafield' })
  getShopMetafield(@Query() query: DefaultAuthRequest) {
    return this.shopifyService.getShopMetafield(query);
  }

  @Get('test')
  test() {
    return this.shopifyService.test();
  }
}
