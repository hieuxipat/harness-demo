import { ShopGeneral } from '@nest/nest-types/modules/shop/entities/shop-general.entity';
import { IShopifyAppMetafieldPayload } from '@nest/nest-types/shared/api/types/shopify-api.types';
import { ReactNode } from 'react';

export interface IAppContext {
  generalSettings?: ShopGeneral;
}

export interface IAppContextProviderProps {
  children: ReactNode;
  metafields: IShopifyAppMetafieldPayload;
}
