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

@Injectable()
export class MatchesService {
    constructor(
        @InjectModel(Matches.name) private matchesModel: Model<MatchesDocument>,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly likesService: LikesService,
    ) {}

    //TODO: Test this one
    async createMatchPair({
        email,
        matchedEmail,
    }: CreateMatchesDto): Promise<MatchI> {
        const matchedPair = new this.matchesModel({
            id: this.genMatchId({ email, matchedEmail }),
            email,
            matchedEmail,
        }).save();

        return matchedPair
            ? matchedPair
            : Promise.reject(
                  new HttpException(
                      'Error creating match pair',
                      HttpStatus.INTERNAL_SERVER_ERROR,
                  ),
              );
    }

    async findMatchedPair({ id }: FindMatchedI): Promise<MatchI> {
        const matchedPair: any = this.matchesModel.findOne({ id }).exec();
        return matchedPair
            ? matchedPair
            : Promise.reject(
                  new HttpException(
                      'No match pair found',
                      HttpStatus.NOT_FOUND,
                  ),
              );
    }

    async genMatchId({ email, matchedEmail }: GetIdMatchedI): Promise<string> {
        return uuidv5(
            `${email}${matchedEmail}-${matchedEmail}${email}`.toLowerCase(),
            this.configService.get<string>('UUID_NAMESPACE'),
        ).toString();
    }

    async checkedGenIdIsMatched({
        email,
        matchedEmail,
    }: GetIdMatchedI): Promise<boolean> {
        const matchId = await this.genMatchId({ email, matchedEmail });
        const IsMatched = await this.findMatchedPair({ id: matchId });
        return IsMatched ? true : false;
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
