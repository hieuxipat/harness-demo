import { Module } from '@nestjs/common';
import { CustomCacheService } from './custom-cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            createKeyv(
              { socket: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT || 6379), connectTimeout: 5000 } },
              {
                namespace: 'order-tracking-central',
                connectionTimeout: 5000,
              },
            ),
            new Keyv({
              store: new CacheableMemory(),
            }),
          ],
          ttl: 1,
          nonBlocking: true,
        };
      },
    }),
  ],
  providers: [CustomCacheService],
  exports: [CustomCacheService, CacheModule],
})
export class CustomCacheModule {}
