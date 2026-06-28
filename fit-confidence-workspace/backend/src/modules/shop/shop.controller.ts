import { Body, Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetChargeUrlResponse,
  ShopCrispDataResponse,
  ShopGeneralSettingResponse,
  UpdateShopGeneralSettingResponse,
} from './response/shop.response';
import { DefaultAuthRequest } from 'src/docs/default/default-request.swagger';
import { GetChargeUrlDto, UpdateGeneralSettingDto } from './dto/shop.dto';
import { HeaderAuthGuard } from 'src/shared/auth/guards/header-auth.guard';
import { Request } from 'express';

@Controller('shop')
@ApiTags('Shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('general-setting')
  @ApiBearerAuth('token')
  @UseGuards(HeaderAuthGuard)
  @ApiOperation({ summary: 'Get shop general setting' })
  @ApiOkResponse({ type: ShopGeneralSettingResponse })
  getShopGeneralSetting(@Query() query: DefaultAuthRequest, @Req() request: Request) {
    return this.shopService.getShopGeneral(query, request.user);
  }

  @Put('general-setting/update')
  @ApiBearerAuth('token')
  @UseGuards(HeaderAuthGuard)
  @ApiOperation({ summary: 'Update shop general setting' })
  @ApiOkResponse({ type: UpdateShopGeneralSettingResponse })
  updateShopGeneralSetting(@Body() body: UpdateGeneralSettingDto) {
    return this.shopService.updateShopGeneral(body);
  }

  @Get('charge')
  @ApiBearerAuth('token')
  @UseGuards(HeaderAuthGuard)
  @ApiOperation({ summary: 'Get charge url' })
  @ApiOkResponse({ type: GetChargeUrlResponse })
  getChargeUrl(@Query() query: GetChargeUrlDto) {
    return this.shopService.getChargeUrl(query);
  }

  @Get('crisp/data')
  @ApiOperation({ summary: 'Get shop crisp info' })
  @ApiOkResponse({ type: ShopCrispDataResponse })
  getShopCrispData(@Query('shop') shop: string) {
    return this.shopService.getShopCrispData(shop);
  }
}
