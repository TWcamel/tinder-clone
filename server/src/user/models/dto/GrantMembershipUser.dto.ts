import { IsEmail, IsNotEmpty } from 'class-validator';

export class GrantMembershipUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    name: string;

    membershipType: string;
}
