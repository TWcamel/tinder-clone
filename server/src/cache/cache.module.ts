import {
    Module,
    CacheModule as NestCacheModule,
    OnModuleInit,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './service/redis-cache.service';

@Module({
    imports: [
        NestCacheModule.registerAsync({
            useFactory: () => {
                return {
                    isGlobal: true,
                    store: redisStore,
                    host: 'localhost',
                    port: 6379,
                    ttl: 86400,
                    max: 100,
                };
            },
        }),
    ],
    providers: [RedisCacheService],
    exports: [NestCacheModule],
})
export class CacheModule {}
