import { IsString, IsDate, IsUrl } from 'class-validator';

export class CreateAvatarsDto {
    @IsString()
    email: string;

    @IsUrl()
    url: string;

    @IsDate()
    updateAt?: Date;
}
