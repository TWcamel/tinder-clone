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
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    public async onModuleInit() {
        const logger = new Logger('Cache');

        const commnad = ['get', 'set', 'del'];

        const cache = this.cacheManager;

        Array.prototype.forEach.call(commnad, (command: string) => {
            cache[command] = async (...args: any[]) => {
                console.log(args);
            };
        });
    }
}
