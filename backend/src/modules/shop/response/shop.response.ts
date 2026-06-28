import { DefaultResponse } from 'src/docs/default/default-response.swagger';
import { ShopGeneral } from '../entities/shop-general.entity';

export class ShopGeneralSettingResponse extends DefaultResponse {
  data: ShopGeneral;
}

export class UpdateShopGeneralSettingResponse extends DefaultResponse {
  data: ShopGeneral;
}

export class GetChargeUrlResponse extends DefaultResponse {
  data?: { url: string };
}

export class ShopCrispDataResponse extends DefaultResponse {
  data?: CrispData;
}

export class CrispData {
  appName?: string;
  emailShop?: string;
  phone?: string;
  city?: string;
  country?: string;
  timezone?: string;
  firstInstalledDate?: Date;
  lastInstalledDate?: Date;
  uninstalledDate?: Date;
  shopifyPlan?: string;
  nameShop?: string;
  plan?: string;
  reviewHistory?: string;
}
