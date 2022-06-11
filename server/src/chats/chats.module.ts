import { Module } from '@nestjs/common';
import { ChatsGateway } from './events/chats.gateway';
import { ChatsController } from './controller/chats.controller';
import { ChatsService } from './service/chats.service';
import { AuthModule } from 'src/auth/auth.module';
import { MatchesModule } from 'src/matches/matches.module';
import { LikesModule } from 'src/likes/likes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './models/chats.schemas';
import { CacheModule as RedisCacheModule } from '../cache/cache.module';
import { RedisCacheService } from '../cache/service/redis-cache.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chats.name, schema: ChatsSchema }]),
        AuthModule,
        MatchesModule,
        RedisCacheModule,
        LikesModule,
    ],
    providers: [ChatsGateway, ChatsService, RedisCacheService],
    controllers: [ChatsController],
    exports: [ChatsService],
})
export class ChatsModule {}
