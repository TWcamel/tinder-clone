import { IsString, IsEmail } from 'class-validator';

export class CreateMatchesDto {
    @IsEmail()
    email: string;

    @IsEmail()
    matchedEmail: string;
}
