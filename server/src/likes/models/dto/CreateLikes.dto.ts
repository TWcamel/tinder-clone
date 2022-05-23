import { IsString, IsBoolean, IsDate } from 'class-validator';

export class CreateLikesDto {
    @IsString()
    id?: string;

    @IsString()
    email: string;

    @IsString()
    matchEmail: string;

    @IsBoolean()
    isLiked: boolean;

    @IsDate()
    updatedAt?: Date;
}
