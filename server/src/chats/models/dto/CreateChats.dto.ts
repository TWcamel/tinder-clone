import {
    IsString,
    IsDate,
    MinLength,
    MaxLength,
    ValidationArguments,
} from 'class-validator';
import { MessagesI } from '../chats.interface';

export class CreateChatsDto {
    @IsString()
    matchedId: string;

    @IsDate()
    editTime: Date;

    @IsString()
    sender: string;

    @IsString()
    message: string;
}
