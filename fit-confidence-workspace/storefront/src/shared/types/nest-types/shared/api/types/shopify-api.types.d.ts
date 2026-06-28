import { ShopGeneral } from 'src/modules/shop/entities/shop-general.entity';
export interface IShopifyAuth {
    shop: string;
    accessToken?: string;
}
export interface IShopifyDiscountPayload {
    value?: {
        percentage: number;
    };
    durationLimitInIntervals?: number;
}
export declare enum MetafieldKey {
    AppData = "app_data"
}
export interface IShopifyAppMetafieldPayload {
    shop: string;
    rootLink: string;
    manualData?: boolean;
    publicKey?: string;
    data?: {
        shopGeneral: ShopGeneral;
    };
}
