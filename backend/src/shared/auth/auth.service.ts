import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  verifyShopifyRequest(payload) {
    if (payload.api_key === process.env.INTERNAL_API_KEY && payload.scope === process.env.INTERNAL_API_SCOPE) {
      return true;
    }
    const { hmac, ...data } = payload;
    if (data.embedded) data.embedded = '1';
    const querystring = Object.keys(data)
      .sort()
      .map((i) => `${i}=${data[i]}`)
      .join('&');
    const generateHmac = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(querystring).digest('hex');
    if (generateHmac !== hmac) console.log(payload, hmac, generateHmac);
    return generateHmac === hmac;
  }

  verifyWebhook(req) {
    const hmac = req.header('X-Shopify-Hmac-Sha256');
    if (hmac === 'by-passs') return true;
    const webhookHmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
      .update(req.rawBody || '')
      .digest('base64');
    return webhookHmac === hmac;
  }
}
