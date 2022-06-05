import { IsString, IsEmail } from 'class-validator';

export class CreateMatchesDto {
    @IsString()
    id?: string;

    @IsEmail()
    email: string;

    @IsEmail()
    matchedEmail: string;
}
