import { IsDate, IsEmail, IsBoolean } from 'class-validator';

export class CreateNextTimeToMatch {
    @IsEmail()
    email: string;

    @IsDate()
    nextTime: Date;
}
