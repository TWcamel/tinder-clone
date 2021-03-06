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
import { AuthService } from 'src/auth/service/auth.service';
import { User, UserDocument } from '../models/user.schemas';
import { Avatar, AvatarDocument } from 'src/aws/models/aws.schemas';
import MockUtils from 'src/utils/mock.utils';

@Injectable()
export class PeopleService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
        private authService: AuthService,
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
                    bio: 1,
                    age: 1,
                    gender: 1,
                    location: 1,
                    avatar: '$avatar.url',
                },
            },
            { $limit: 1 },
        ]);
    }
}
