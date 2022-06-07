import { Model } from 'mongoose';
import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { User, UserDocument } from '../models/user.schemas';

@Injectable()
export class PeopleService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findOnePplWithAvatar(id: string): Promise<any> {
        return this.userModel.aggregate([
            {
                $match: { email: id },
            },
            {
                $lookup: {
                    from: 'avatars',
                    localField: 'email',
                    foreignField: 'email',
                    as: 'avatar',
                },
            },
            {
                $unwind: {
                    path: '$avatar',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    email: 1,
                    name: 1,
                    avatar: {
                        url: 1,
                    },
                },
            },
            { $limit: 1 },
        ]);
    }
}
