import { IsString } from 'class-validator';

export class CreateMatchesDto {
    @IsString()
    id?: string;

    @IsString()
    email: string;

    @IsString()
    matchedEmail: string;
}
