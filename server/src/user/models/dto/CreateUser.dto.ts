import {
    IsString,
    MinLength,
    MaxLength,
    ValidationArguments,
} from 'class-validator';
import { LoginUserDto } from './LoginUser.dto';

export class CreateUserDto extends LoginUserDto {
    @IsString()
    name: string;

    @IsString()
    facebookId: string;

    @IsString()
    googleId: string;

    @IsString()
    membershipType: string;

    @IsString()
    gender: string;

    @MinLength(1, { each: true })
    @MaxLength(4000, { each: true })
    avatar: string[];
}
