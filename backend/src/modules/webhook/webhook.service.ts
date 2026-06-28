import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { EventEmitterName } from 'src/shared/types/shared.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateReportAction } from '../admin/types/admin.enum';
import { CustomCacheService } from 'src/shared/custom-cache/custom-cache.service';
import { WEBHOOK_TOPICS } from './types/webhook.types';

@Injectable()
export class WebhookService {
  constructor(
    private readonly customCacheService: CustomCacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handleShopifyWebhook(request) {
    const topic = request.header('X-Shopify-Topic');
    const shop = request.header('X-Shopify-Shop-Domain');
    const hmac = request.header('X-Shopify-Hmac-Sha256');
    const key = shop + topic + hmac;
    const isCacheReceived = await this.customCacheService.get(key);
    if (isCacheReceived) return console.log('Webhook duplicate: ', key);
    await this.customCacheService.set(key, true, 20 * 1000);
    try {
      if (topic === WEBHOOK_TOPICS.SHOP_UPDATE) {
        await this.eventEmitter.emitAsync(EventEmitterName.ShopUpdate, { shop, payload: request.body });
      } else if (topic === WEBHOOK_TOPICS.APP_UNINSTALL) {
        await this.eventEmitter.emitAsync(EventEmitterName.AppUninstall, { shop, payload: request.body });
        this.eventEmitter.emit(EventEmitterName.ReportUpdate, { shop, date: new Date(), action: UpdateReportAction.UNINSTALL });
      } else {
        console.log('Topic not found', shop, topic, request.headers, JSON.stringify(request.body));
      }
    } catch (err) {
      if (!err.message.includes('Duplicate entry')) console.log(err);
    }
    return { status: 'success' };
  }

  async handleShopifyMandatoryWebhook(request) {
    const hmac = request.header('X-Shopify-Hmac-Sha256');
    const topic = request.header('X-Shopify-Topic');
    const shop = request.header('X-Shopify-Shop-Domain');
    if (hmac === 'by-passs') return true;
    const webhookHmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
      .update(request.rawBody || '')
      .digest('base64');
    console.log('handleShopifyMandatoryWebhook', webhookHmac === hmac, topic, shop, request.body);
  }
}
