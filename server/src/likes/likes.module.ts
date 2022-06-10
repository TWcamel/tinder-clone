import { Module, Inject, forwardRef } from '@nestjs/common';
import { LikesController } from './controller/likes.controller';
import { LikesService } from './service/likes.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MatchesModule } from 'src/matches/matches.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Likes, LikesSchema } from './models/likes.schemas';
import { CacheModule as RedisCacheModule } from '../cache/cache.module';
import { RedisCacheService } from '../cache/service/redis-cache.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
        AuthModule,
        UserModule,
        RedisCacheModule,
        forwardRef(() => MatchesModule),
    ],
    controllers: [LikesController],
    providers: [LikesService, RedisCacheService],
    exports: [LikesService],
})
export class LikesModule {}
