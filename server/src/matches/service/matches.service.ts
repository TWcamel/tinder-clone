import { Model } from 'mongoose';
import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Matches, MatchesDocument } from '../models/matches.schemas';
import { CreateMatchesDto } from '../models/dto/CreateMatches.dto';
import { UserService } from 'src/user/service/user.service';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import {
    MatchI,
    FindMatchedI,
    GetIdMatchedI,
} from '../models/matches.interface';
import { GetIdLikeI } from 'src/likes/models/likes.interface';
import { LikesService } from 'src/likes/service/likes.service';
import ArrayUtils from 'src/utils/array.utils';
import {
    NextTimeToMatch,
    NextTimeToMatchDocument,
} from '../models/next.time.match.schemas';
import DateTimeUtils from 'src/utils/time.utils';

@Injectable()
export class MatchesService {
    constructor(
        @InjectModel(Matches.name)
        private readonly matchesModel: Model<MatchesDocument>,
        @InjectModel(NextTimeToMatch.name)
        private readonly nextTimeToMatchModel: Model<NextTimeToMatchDocument>,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly likesService: LikesService,
    ) {}

    async createMatchPair({
        email,
        matchedEmail,
    }: CreateMatchesDto): Promise<void> {
        const users = await this.userService.findAll();
        const userList = users.reverse().map(async (user) => {
            // this.createOrUpdateLike({
            //     email: user.email,
            //     matchEmail: 'crispyfriedabc@crispyfriedabc.com',
            //     isLiked,
            //     updateAt: new Date(),
            // });

            // const matchId = await this.checkGenIdIsMatched({
            //     email: user.email,
            //     // matchedEmail,
            //     matchedEmail: 'crispyfriedabc@crispyfriedabc.com',
            // });
            // if (matchId)
            //     return Promise.reject(
            //         new HttpException(
            //             `Match already exists`,
            //             HttpStatus.BAD_REQUEST,
            //         ),
            //     );

            const matchedPair = await new this.matchesModel({
                id: await this.genMatchId({
                    email: user.email,
                    matchedEmail: 'tzuyu@tzuyu.com',
                }),
                email: user.email,
                matchedEmail: 'tzuyu@tzuyu.com',
            }).save();

            if (!matchedPair)
                Promise.reject(
                    new HttpException(
                        'Error creating match pair',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    ),
                );
        });
    }

    async getNextSwipe({ email }): Promise<any> {
        return await this.nextTimeToMatchModel.findOneAndUpdate(
            { email },
            {
                email,
                nextTimeToMatch: DateTimeUtils.tomorrow(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );
    }

    async findMatchedPair({ id }: FindMatchedI): Promise<MatchI> {
        const matchedPair: any = await this.matchesModel.findOne({ id }).exec();
        return matchedPair ? matchedPair : false;
    }

    async getMatches({ email }: { email: string }): Promise<MatchI[]> {
        const matchedPairs: any = await this.matchesModel
            .aggregate([
                {
                    $match: {
                        $or: [{ email: email }, { matchedEmail: email }],
                    },
                },
                {
                    $lookup: {
                        from: 'avatars',
                        localField: 'email',
                        foreignField: 'email',
                        as: 'userAvatar',
                    },
                },
                {
                    $lookup: {
                        from: 'avatars',
                        localField: 'matchedEmail',
                        foreignField: 'email',
                        as: 'matchedAvatar',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'email',
                        foreignField: 'email',
                        as: 'user',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'matchedEmail',
                        foreignField: 'email',
                        as: 'matched',
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        email: {
                            $cond: {
                                if: { $eq: ['$email', email] },
                                then: '$matchedEmail',
                                else: '$email',
                            },
                        },
                        avatar: {
                            $cond: {
                                if: { $eq: ['$email', email] },
                                then: {
                                    $arrayElemAt: ['$matchedAvatar.url', 0],
                                },
                                else: { $arrayElemAt: ['$userAvatar.url', 0] },
                            },
                        },
                        name: {
                            $cond: {
                                if: { $eq: ['$email', email] },
                                then: {
                                    $arrayElemAt: ['$matched.name', 0],
                                },
                                else: { $arrayElemAt: ['$user.name', 0] },
                            },
                        },
                    },
                },
            ])
            .exec();
        return matchedPairs;
    }

    async genMatchId({ email, matchedEmail }: GetIdMatchedI): Promise<string> {
        const input = ArrayUtils.sortByLocale([email, matchedEmail]).join('');
        return uuidv5(
            input.toLowerCase(),
            this.configService.get<string>('UUID_NAMESPACE'),
        ).toString();
    }

    async checkGenIdIsMatched({
        email,
        matchedEmail,
    }: GetIdMatchedI): Promise<any> {
        const matchId = await this.genMatchId({ email, matchedEmail });
        const IsMatched = await this.findMatchedPair({ id: matchId });
        return IsMatched ? IsMatched.id : false;
    }

    async checkIsAMatch({ email, matchEmail }: GetIdLikeI): Promise<boolean> {
        const likeToken = await this.likesService.genLikeToken({
            email,
            matchEmail,
        });
        const isAMatch = await this.likesService.findLikeToken({
            id: likeToken,
        });
        return isAMatch ? true : false;
    }
}
