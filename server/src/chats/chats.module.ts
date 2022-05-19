import { Module } from '@nestjs/common';
import { ChatsGateway } from './events/chats.gateway';
import { ChatsController } from './controller/chats.controller';
import { ChatsService } from './service/chats.service';
import { AuthModule } from 'src/auth/auth.module';
import { MatchesModule } from 'src/matches/matches.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './models/chats.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chats.name, schema: ChatsSchema }]),
        AuthModule,
        MatchesModule,
    ],
    providers: [ChatsGateway, ChatsService],
    controllers: [ChatsController],
    exports: [ChatsService],
})
export class ChatsModule {}
