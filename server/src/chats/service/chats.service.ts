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
import { Time } from 'src/utils/time';

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
                updateAt: Time.convertToLocal(newChat.updateAt),
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
}
