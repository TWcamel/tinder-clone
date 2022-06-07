import {
    IsString,
    MinLength,
    MaxLength,
    ValidationArguments,
    IsNumber,
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

    @IsNumber()
    age: number;

    // @MinLength(1, { each: true })
    // avatar: string[];

    @IsString()
    bio: string;
}
