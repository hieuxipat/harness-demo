import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_OPTIONS, QUEUE_PREFIX } from './shared/queue/types/queue.constant';
import { SharedModule } from './shared/shared.module';
import { LoggingMiddleware } from './shared/middlewares/logging.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AdminModule } from './modules/admin/admin.module';
import { AppPricingModule } from './modules/app-pricing/app-pricing.module';
import { ShopModule } from './modules/shop/shop.module';
import { ShopifyModule } from './modules/shopify/shopify.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { HealthModule } from './shared/health/health.module';
import { DatabaseModule } from './shared/database/database.module';
import { MonitoringModule } from './shared/monitoring/monitoring.module';

@Module({
  imports: [
    MonitoringModule,
    DatabaseModule,
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      prefix: QUEUE_PREFIX,
      defaultJobOptions: QUEUE_OPTIONS,
    }),
    AdminModule,
    AppPricingModule,
    ShopModule,
    ShopifyModule,
    SharedModule,
    WebhookModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).exclude('webhook/(.*)').forRoutes('*');
  }
}
