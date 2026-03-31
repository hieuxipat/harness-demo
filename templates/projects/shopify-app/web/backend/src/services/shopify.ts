import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';

export const shopifyService = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || '{{shopify_api_key}}',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  scopes: ['write_products', 'read_orders'],
  hostName: process.env.HOST || 'localhost',
  apiVersion: ApiVersion.January24,
  isEmbeddedApp: true,
});
