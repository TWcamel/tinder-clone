import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class RedisCacheService {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}
    private logger = new Logger('RedisService');
    private redisClientName = this.configService.get('REDIS_CLIENT_NAME');

    async root(): Promise<boolean> {
        const client = this.redisService.getClient(this.redisClientName);
        return true;
    }

    async get(key: string): Promise<string> {
        const client = this.redisService.getClient(this.redisClientName);
        return await client.get(key);
    }

    async set(key: string, value: string): Promise<string> {
        const client = this.redisService.getClient(this.redisClientName);
        return await client.set(key, value);
    }

    async del(key: string): Promise<number> {
        const client = this.redisService.getClient(this.redisClientName);
        return await client.del(key);
    }

    async getKeys(): Promise<string[]> {
        const client = this.redisService.getClient(this.redisClientName);
        return await client.keys('*');
    }
}
