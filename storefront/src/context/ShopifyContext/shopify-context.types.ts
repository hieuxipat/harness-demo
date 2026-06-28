import { EShopifyPage } from '@nest/shared.types';

export interface IShopifyContext {
  locale: string;
  currentPage: EShopifyPage;
  shop: string;
}
