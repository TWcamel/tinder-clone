import {
    IsString,
    MinLength,
    MaxLength,
    ValidationArguments,
    IsNumber,
    IsDate,
} from 'class-validator';

export class CreateUserInterestsDto {
    @IsString()
    id: string;

    @IsString()
    gender: string;

    @MinLength(1, { each: true })
    @MaxLength(2, { each: true })
    ageRange: number[];

    @IsString()
    location: string;

    @IsDate()
    updateAt: Date;
}
