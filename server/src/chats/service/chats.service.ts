import { Model } from 'mongoose';
import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
    Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats, ChatsDocument } from '../models/chats.schemas';
import { CreateChatsDto } from '../models/dto/CreateChats.dto';
import { MatchesService } from 'src/matches/service/matches.service';
import { LikesService } from 'src/likes/service/likes.service';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import DateTime from 'src/utils/time.utils';
import * as ChatsI from '../models/chats.interface';

@Injectable()
export class ChatsService {
    constructor(
        @InjectModel(Chats.name) private chatModel: Model<ChatsDocument>,
        private readonly configService: ConfigService,
        private readonly matchesService: MatchesService,
        private readonly likesService: LikesService,
    ) {}
    private readonly logger = new Logger('ChatsService');

    async updateOrCreateChat({
        sender,
        reciever,
        message,
    }: ChatsI.ReceivedMessageI): Promise<ChatsI.ChatI> {
        const matchedId: string = await this.matchesService.genMatchId({
            email: sender,
            matchedEmail: reciever,
        });
        const isMatched = await this.matchesService.checkGenIdIsMatched({
            email: sender,
            matchedEmail: reciever,
        });
        if (isMatched && message) {
            let formattedMessage = {
                message,
                sender,
                updateAt: new Date(),
            };
            const newChat: any = await new this.chatModel({
                ...formattedMessage,
                matchedId,
            }).save();
            formattedMessage = {
                message: newChat.message,
                sender: newChat.sender,
                updateAt: DateTime.convertToLocal(newChat.updateAt),
            };
            return formattedMessage;
        } else {
            return Promise.reject(
                new HttpException(
                    'You are not matched with this user',
                    HttpStatus.BAD_REQUEST,
                ),
            );
        }
    }

    async saveMessage({
        sender,
        reciever,
        message,
        updateAt,
    }: ChatsI.ReceivedMessageI): Promise<ChatsI.ChatI> {
        let formattedMessage = {
            message,
            sender,
            updateAt: updateAt || new Date(),
        };
        const newChat: any = await new this.chatModel({
            ...formattedMessage,
            matchedId: await this.matchesService.checkGenIdIsMatched({
                email: sender,
                matchedEmail: reciever,
            }),
        }).save();
        formattedMessage = {
            message: newChat.message,
            sender: newChat.sender,
            updateAt: DateTime.convertToLocal(newChat.updateAt),
        };
        return formattedMessage;
    }

    async getChatId({
        sender,
        reciever,
    }: ChatsI.SenderAndRecieverI): Promise<string> {
        const matchedId: string = await this.matchesService.genMatchId({
            email: sender,
            matchedEmail: reciever,
        });
        const isMatched = await this.matchesService.checkGenIdIsMatched({
            email: sender,
            matchedEmail: reciever,
        });
        if (isMatched) return matchedId;
        else
            return Promise.reject(
                new HttpException(
                    'You are not matched with this user',
                    HttpStatus.BAD_REQUEST,
                ),
            );
    }
}
