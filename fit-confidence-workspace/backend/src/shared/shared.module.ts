import { Global, Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { QueueModule } from './queue/queue.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { CustomCacheModule } from './custom-cache/custom-cache.module';

@Global()
@Module({
  imports: [ApiModule, QueueModule, LoggerModule, AuthModule, CustomCacheModule],
  exports: [ApiModule, QueueModule, LoggerModule, AuthModule, CustomCacheModule],
})
export class SharedModule {}
