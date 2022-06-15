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

    async mock(): Promise<any> {
        const newUser = await this.userModel
            .find({
                $expr: { $gt: [{ $strLenCP: '$bio' }, 200] },
            })
            .updateMany([
                {
                    $set: {
                        bio: { $substrCP: ['$bio', 0, 200] },
                    },
                },
            ])
            .exec();

        console.log(newUser);

        return newUser;

        // const randomName = MockUtils.generateRandomName();
        // const randonEmail =
        //     randomName.toLowerCase().replace(/\s/g, '') +
        //     '@' +
        //     randomName.toLowerCase().replace(/\s/g, '') +
        //     '.com';
        // const password = await this.authService.hashPassword(
        //     randomName.toLowerCase().replace(/\s/g, ''),
        // );
        // const age = MockUtils.generateNumber(18, 60);
        // const location = MockUtils.generateRandomLocation();
        //
        // const mockUser = await this.userModel
        //     .aggregate([
        //         { $sample: { size: 1 } },
        //         {
        //             $lookup: {
        //                 from: 'avatars',
        //                 localField: 'email',
        //                 foreignField: 'email',
        //                 as: 'avatar',
        //             },
        //         },
        //         {
        //             $unwind: {
        //                 path: '$avatar',
        //                 preserveNullAndEmptyArrays: true,
        //             },
        //         },
        //         {
        //             $project: {
        //                 _id: 0,
        //                 bio: 1,
        //                 avatar: '$avatar.url',
        //                 name: randomName,
        //                 email: randonEmail,
        //                 password: { $literal: password },
        //                 age: { $literal: age },
        //                 location: location,
        //                 gender: 1,
        //             },
        //         },
        //         {
        //             $limit: 1,
        //         },
        //     ])
        //     .exec();
        //
        // const newUser = await new this.userModel(mockUser[0]).save();
        // await new this.avatarModel({
        //     email: newUser.email,
        //     url: mockUser[0].avatar,
        // }).save();
        //
        // const pplDontHaveAvatar = await this.avatarModel.find({}).exec();
        //
        // let pplList: any[] = pplDontHaveAvatar.map((ppl: any) => ppl.email);
        //
        // const tt = await this.userModel
        //     .find({})
        //     .where('email')
        //     .nin(pplList)
        //     .exec();
        //
        // pplList = tt.map((ppl: any) => ppl.email);
        //
        // await this.userModel
        //     .deleteMany({
        //         email: { $in: pplList },
        //     })
        //     .exec();
        //
        // pplList = await this.userModel
        //     .aggregate([
        //         {
        //             $match: {
        //                 $and: [
        //                     { avatar: { $exists: false } },
        //                     { email: { $ne: '' } },
        //                 ],
        //             },
        //         },
        //         {
        //             $project: {
        //                 _id: 0,
        //                 email: 1,
        //             },
        //         },
        //     ])
        //     .exec();
        //
        // pplList = pplList.map((ppl: any) => ppl.email);
        //
        // const qq = await this.avatarModel
        //     .find({})
        //     .where('email')
        //     .nin(pplList)
        //     .exec();
        //
        // pplList = qq.map((ppl: any) => ppl.email);
        //
        // await this.avatarModel
        //     .deleteMany({
        //         email: { $in: pplList },
        //     })
        //     .exec();
        //
        // return newUser;
    }
}
