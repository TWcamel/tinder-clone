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
import { Matches, MatchesDocument } from 'src/matches/models/matches.schemas';
import { Likes, LikesDocument } from 'src/likes/models/likes.schemas';
import { User, UserDocument } from '../models/user.schemas';
import { AuthService } from 'src/auth/service/auth.service';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateUserInterestsDto } from '../models/dto/CreateInterests.dto';
import ArrayUtils from 'src/utils/array.utils';

@Injectable()
export class InterestsService {
    constructor(
        @InjectModel(Interest.name)
        private readonly interestsModel: Model<InterestDocument>,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(Matches.name)
        private readonly matchesModel: Model<MatchesDocument>,
        @InjectModel(Likes.name)
        private readonly likesModel: Model<LikesDocument>,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    async getPplWithMyInterestsWithoutMached(id: string): Promise<any> {
        const interests = await this.interestsModel.findOne({ id }).exec();
        const pplWithMyInterests = await this.userModel.aggregate([
            {
                $match: {
                    email: { $ne: interests.id },
                    gender: { $eq: interests.gender },
                    age: {
                        $gte: interests.ageRange[0],
                        $lt: interests.ageRange[1],
                    },
                    location: { $eq: interests.location },
                },
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
                $project: {
                    _id: 0,
                    name: 1,
                    email: 1,
                    age: 1,
                    gender: 1,
                    location: 1,
                    avatar: { $arrayElemAt: ['$avatar.url', 0] },
                    bio: 1,
                    userInterests: {
                        ageRange: interests.ageRange,
                        gender: interests.gender,
                        location: interests.location,
                        email: interests.id,
                    },
                },
            },
            {
                $limit: 25,
            },
        ]);

        const formattedPplEmail = pplWithMyInterests.map(
            (user: any) => user.email,
        );

        const matchedPpl = await this.matchesModel
            .find({
                $or: [
                    {
                        $and: [
                            { email: { $in: formattedPplEmail } },
                            { matchedEmail: { $eq: id } },
                        ],
                    },
                    {
                        $and: [
                            { matchedEmail: { $in: formattedPplEmail } },
                            { email: { $eq: id } },
                        ],
                    },
                ],
            })
            .exec();

        if (
            !ArrayUtils.isEmpty(matchedPpl) &&
            ArrayUtils.isEqual(formattedPplEmail, matchedPpl)
        ) {
            throw new HttpException(
                'You have already mached with all the people with your interests',
                HttpStatus.BAD_REQUEST,
            );
        }

        const notMatchedPpl = pplWithMyInterests.filter(
            (user: any) =>
                !matchedPpl.some(
                    (mached: any) =>
                        mached.email === user.email ||
                        mached.matchedEmail === user.email,
                ),
        );

        const likedPpl = await this.likesModel.find({ email: id }).exec();

        const notLikedAndNotMatchedPpl = notMatchedPpl.filter(
            (user: any) =>
                !likedPpl.some(
                    (liked: any) =>
                        liked.matchEmail === user.email ||
                        liked.matchEmail === user.matchedEmail,
                ),
        );

        return notLikedAndNotMatchedPpl;
    }

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
