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
    lastEditTime: Date;

    @MinLength(1, {
        each: true,
        message: (targetName: ValidationArguments) => {
            if (targetName.value.length < 1)
                return `${targetName.property} is too short`;
        },
    })
    @MaxLength(4000, {
        each: true,
        message: (targetName: ValidationArguments) => {
            if (targetName.value.length < 1)
                return `${targetName.property} is too short`;
        },
    })
    chatContext: string[];
}
