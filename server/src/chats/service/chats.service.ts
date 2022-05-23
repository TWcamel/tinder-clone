import { Model } from 'mongoose';
import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats, ChatsDocument } from '../models/chats.schemas';
import { CreateChatsDto } from '../models/dto/CreateChats.dto';
import { MatchesService } from 'src/matches/service/matches.service';
import { LikesService } from 'src/likes/service/likes.service';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ChatI, ReceivedMessageI } from '../models/chats.interface';

@Injectable()
export class ChatsService {
    constructor(
        @InjectModel(Chats.name) private chatModel: Model<ChatsDocument>,
        private readonly configService: ConfigService,
        private readonly matchesService: MatchesService,
        private readonly likesService: LikesService,
    ) {}

    async updateOrCreateChat({
        sender,
        reciever,
        message,
    }: ReceivedMessageI): Promise<ChatI> {
        const matchedId: string = await this.matchesService.genMatchId({
            email: sender,
            matchedEmail: reciever,
        });
        const isMatched = await this.matchesService.checkedGenIdIsMatched({
            email: sender,
            matchedEmail: reciever,
        });
        //TODO: make message to another document
        if (isMatched && message) {
            const chat: any = await this.chatModel.findOne({
                matchedId,
            });
            const formattedMessage = {
                user: sender,
                message,
                updateAt: new Date(),
            };
            if (chat) {
                chat.chatContext.push(formattedMessage);
                chat.save();
                return {
                    updatedTime: chat.lastEditTime,
                    messages: chat.chatContext,
                };
            } else {
                const newChat: any = new this.chatModel({
                    matchedId,
                    chatContext: formattedMessage,
                });
                await newChat.save();
                return newChat;
            }
        } else {
            return Promise.reject(
                new HttpException(
                    'You are not matched with this user',
                    HttpStatus.BAD_REQUEST,
                ),
            );
        }
    }
}
