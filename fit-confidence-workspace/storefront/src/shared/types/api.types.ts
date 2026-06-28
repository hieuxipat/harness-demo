export const APP_API = {
  GET: {
    GET_SHOP_METAFIELDS: '/shop/metafields',
  },
};

export type APP_API_METHOD = keyof typeof APP_API;

export type APP_API_SERVICE<M extends APP_API_METHOD> = keyof (typeof APP_API)[M];

export interface IApiPayload {
  params?: Record<string, unknown>;
  replacePath?: Record<string, string>;
  data?: Record<string, unknown>;
}
