import { IShopifyAppMetafieldPayload } from './nest-types/shared/api/types/shopify-api.types';
import { EShopifyPage } from './shared.types';

declare global {
  interface Window {
    appMetafields?: IShopifyAppMetafieldPayload;
    dingdoongDesignMode: boolean;
    __st: {
      a: number;
      offset: number;
      p: EShopifyPage;
      pageurl: string;
      reqid: string;
      rid: number;
      rtyp: string;
      t: string;
      u: string;
    };
    Shopify?: {
      routes: {
        root: string;
      };
      shop: string;
      locale: string;
      country: string;
      currency: {
        active: string;
        rate: string;
      };
    };
  }
}
