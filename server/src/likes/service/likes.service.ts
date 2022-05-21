import { Model } from 'mongoose';
import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Likes, LikesDocument } from '../models/likes.schemas';
import { CreateLikesDto } from '../models/dto/CreateLikes.dto';
import { UserService } from 'src/user/service/user.service';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { LikeI, FindLikedI, GetIdLikeI } from '../models/like.interface';

@Injectable()
export class LikesService {
    constructor(
        @InjectModel(Likes.name) private likesModel: Model<LikesDocument>,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    async userALikesUserB({
        email,
        matchedEmail,
    }: CreateLikesDto): Promise<LikeI> {
        if (
            !(await this.userService.mailsExists([email, matchedEmail])) ||
            email === matchedEmail
        )
            return Promise.reject(
                new HttpException(
                    'Provided email is not valid or you trying to selfmatching',
                    HttpStatus.NOT_FOUND,
                ),
            );
        else {
            const likeToken: string = await this.getLikeToken({
                email,
                matchedEmail,
            });
            const newLikeToken = new this.likesModel({
                id: likeToken,
                email,
                matchedEmail,
            }).save();
            return newLikeToken
                ? newLikeToken
                : Promise.reject(
                      new HttpException(
                          'Error creating like token pair',
                          HttpStatus.INTERNAL_SERVER_ERROR,
                      ),
                  );
        }
    }

    async findLikeToken({ id }: FindLikedI): Promise<LikeI> {
        const likeToken: any = this.likesModel.findOne({ id }).exec();
        return likeToken
            ? likeToken
            : Promise.reject(
                  new HttpException(
                      'No match pair found',
                      HttpStatus.NOT_FOUND,
                  ),
              );
    }

    async getLikeToken({ email, matchedEmail }: GetIdLikeI): Promise<string> {
        return uuidv5(
            `${email}${matchedEmail}`.toLowerCase(),
            this.configService.get<string>('UUID_NAMESPACE'),
        ).toString();
    }
}
