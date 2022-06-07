import { Model } from 'mongoose';
import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interest, InterestDocument } from '../models/user-interests.schemas';
import { AuthService } from 'src/auth/service/auth.service';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateUserInterestsDto } from '../models/dto/CreateInterests.dto';

@Injectable()
export class InterestsService {
    constructor(
        @InjectModel(Interest.name)
        private readonly interestsModel: Model<InterestDocument>,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    async findOneOrCreate(
        createUserInterestsDto: CreateUserInterestsDto,
    ): Promise<Interest> {
        const { id } = createUserInterestsDto;
        const interest = await this.interestsModel.findOne({ id }).exec();
        if (interest) {
            return interest;
        }
        return await this.interestsModel.create(createUserInterestsDto);
    }

    async update(
        id: string,
        createUserInterestsDto: CreateUserInterestsDto,
    ): Promise<Interest> {
        const { ageRange, gender, location } = createUserInterestsDto;
        return await this.interestsModel
            .findOneAndUpdate(
                { id: id },
                { ageRange, gender, location },
                { new: true },
            )
            .exec();
    }

    async findOne(id: string): Promise<Interest> {
        return await this.interestsModel.findOne({ id });
    }
}
