import { IShopifyShopData } from 'src/modules/shopify/types/shopify.interface';

export interface IShopUpdateEvent {
  shop: string;
  payload: IShopifyShopData;
}
