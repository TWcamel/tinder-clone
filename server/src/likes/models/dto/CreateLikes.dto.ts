import { IsString } from 'class-validator';

export class CreateLikesDto {
    @IsString()
    id?: string;

    @IsString()
    email: string;

    @IsString()
    matchEmail: string;
}
