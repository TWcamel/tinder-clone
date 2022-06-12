import {
    Module,
    CacheModule as NestCacheModule,
    OnModuleInit,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './service/redis-cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        NestCacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                console.log(configService.get('REDIS_URL'));
                console.log(configService.get('REDIS_HOST'));
                return {
                    store: redisStore,
                    host: 'localhost111',
                    port: configService.get('REDIS_PORT'),
                    ttl: configService.get('CACHE_TTL'),
                };
            },
        }),
    ],
    providers: [RedisCacheService],
    exports: [NestCacheModule],
})
export class CacheModule {}
