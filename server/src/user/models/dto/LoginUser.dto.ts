import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    password: string;

    facebookId: string;

    googleId: string;
}
