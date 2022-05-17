import { Module } from '@nestjs/common';
import { ChatsGateway } from './events/chats.gateway';
import { ChatsController } from './controller/chats.controller';
import { ChatsService } from './service/chats.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [ChatsGateway, ChatsService],
    controllers: [ChatsController],
})
export class ChatsModule {}
