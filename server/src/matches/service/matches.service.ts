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

@Injectable()
export class MatchesService {
    constructor(
        @InjectModel(Matches.name) private matchesModel: Model<MatchesDocument>,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    // TODO: fix this one
    // ERROR: this one is a like function, not not a match function
    async createMatchPair({
        email,
        matchedEmail,
    }: CreateMatchesDto): Promise<MatchI> {
        const isUserEmailExists: boolean = await this.userService.mailExists(
            email,
        );
        const isRecipientEmailExists: boolean =
            await this.userService.mailExists(matchedEmail);

        if (
            !(isUserEmailExists && isRecipientEmailExists) ||
            email === matchedEmail
        )
            return Promise.reject(
                new HttpException(
                    'Provided email is not valid or you trying to selfmatching',
                    HttpStatus.NOT_FOUND,
                ),
            );
        else {
            const matchId: string = await this.getMatchId({
                email,
                matchedEmail,
            });
            const matchedPair = new this.matchesModel({
                id: matchId,
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

    async getMatchId({ email, matchedEmail }: GetIdMatchedI): Promise<string> {
        return uuidv5(
            `${email}${matchedEmail}`.toLowerCase(),
            this.configService.get<string>('UUID_NAMESPACE'),
        ).toString();
    }
}
