import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
    Inject,
    CACHE_MANAGER,
    OnModuleInit,
    Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { createClient, RedisClientOptions, RedisClientType } from 'redis';

@Injectable()
export class RedisCacheService {
    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}
    private cache = this.cacheManager;
    private logger = new Logger('RedisCache');

    //ENGENCE: client should be integrated with cache manager
    private redisClient = createClient(
        this.configService.get<string>('REDIS_PORT'),
    );

    async get(key: string): Promise<any> {
        this.logger.log(`GET ${key}`);
        return this.cache.get(key);
    }

    async set(key: string, value: any, ttl?: number): Promise<any> {
        this.logger.log(`SET ${key}`);
        return this.cache.set(key, value, ttl);
    }

    async del(key: string): Promise<any> {
        this.logger.log(`DEL ${key}`);
        return this.cache.del(key);
    }

    async invalidate(key: string): Promise<any> {
        this.logger.log(`INVALIDATE ${key}`);
        return this.cache.del(key);
    }

    async invalidatePrefix(prefix: string): Promise<any> {
        this.logger.log(`INVALIDATE PREFIX ${prefix}`);
        return this.cache.del(prefix);
    }

    async reset(): Promise<any> {
        this.logger.log('RESET');
        return this.cache.reset();
    }

    async zAdd(key: string, score: number, value: any): Promise<any> {
        this.logger.log(`ZADD ${key}`);
        return this.redisClient.zadd(key, score, value);
    }

    async getRedisClientConnected(): Promise<any> {
        return this.redisClient;
    }

    async mset(key: string, value: any): Promise<any> {
        this.logger.log(`MSET ${key}`);
        return this.cache.store.mset(key, value);
    }

    async mget(key: string): Promise<any> {
        this.logger.log(`MGET ${key}`);
        return this.cache.store.mget(key);
    }

    //BUG: always return true
    async zRange(key: string, start: number, stop: number): Promise<any> {
        return this.redisClient.zrange(key, start, stop);
    }
}
