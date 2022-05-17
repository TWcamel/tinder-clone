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

@Injectable()
export class MatchesService {
    constructor(
        @InjectModel(Matches.name) private matchesModel: Model<MatchesDocument>,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    async createMatchPair({
        email,
        matchedEmail,
    }: CreateMatchesDto): Promise<object> {
        const isUserEmailExists: boolean = await this.userService.mailExists(
            email,
        );
        const isRecipientEmailExists: boolean =
            await this.userService.mailExists(matchedEmail);

        if (
            !(isUserEmailExists && isRecipientEmailExists) ||
            email === matchedEmail
        )
            throw new HttpException(
                'Provided email is not valid or you trying to selfmatching',
                HttpStatus.NOT_FOUND,
            );
        else {
            try {
                const matchId: string = uuidv5(
                    `${email}${matchedEmail}`.toLowerCase(),
                    this.configService.get<string>('UUID_NAMESPACE'),
                ).toString();
                const matchedPair = new this.matchesModel({
                    id: matchId,
                    email,
                    matchedEmail,
                }).save();
                if (matchedPair) return matchedPair;
            } catch (error) {
                throw new HttpException(
                    'Error creating match pair',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}
