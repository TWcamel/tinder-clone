import { Module } from '@nestjs/common';
import { RedisCacheService } from './service/redis.cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as RedisCacheModule } from 'nestjs-redis';

@Module({
    imports: [
        RedisCacheModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    name: configService.get('REDIS_CLIENT_NAME'),
                    url: configService.get('REDIS_URL'),
                    password: configService.get('REDIS_PASSWORD'),
                };
            },
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheModule],
})
export class CacheModule {}
