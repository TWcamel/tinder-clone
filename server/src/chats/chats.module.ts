import { Module } from '@nestjs/common';
import { ChatsGateway } from './events/chats.gateway';

@Module({
    providers: [ChatsGateway],
})
export class ChatsModule {}
