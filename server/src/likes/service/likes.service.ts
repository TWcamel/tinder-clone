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
import { LikeI, FindLikedI, GetIdLikeI } from '../models/likes.interface';

@Injectable()
export class LikesService {
    constructor(
        @InjectModel(Likes.name) private likesModel: Model<LikesDocument>,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    async userAActsUserB({
        email,
        matchEmail,
        isLiked,
    }: CreateLikesDto): Promise<LikeI> {
        if (
            !(await this.userService.mailsExists([email, matchEmail])) ||
            email === matchEmail
        )
            return Promise.reject(
                new HttpException(
                    'Provided email is not valid or you trying to selfmatching',
                    HttpStatus.NOT_FOUND,
                ),
            );
        else {
            const newLike = await this.createOrUpdateLike({
                email,
                matchEmail,
                isLiked,
                updatedAt: new Date(),
            });
            return newLike
                ? newLike
                : Promise.reject(
                      new HttpException(
                          'Error creating like token pair',
                          HttpStatus.INTERNAL_SERVER_ERROR,
                      ),
                  );
        }
    }

    async createOrUpdateLike({
        email,
        matchEmail,
        isLiked,
    }: CreateLikesDto): Promise<LikesDocument> {
        const likeToken: string = await this.genLikeToken({
            email,
            matchEmail,
        });
        const newLikedToken = await this.likesModel
            .findOneAndUpdate(
                {
                    id: likeToken,
                },
                { isLiked },
                { upsert: true, new: true },
            )
            .exec();
        return newLikedToken
            ? newLikedToken
            : Promise.reject(
                  new HttpException(
                      'Error creating like token pair',
                      HttpStatus.INTERNAL_SERVER_ERROR,
                  ),
              );
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

    async genLikeToken({ email, matchEmail }: GetIdLikeI): Promise<string> {
        return uuidv5(
            `${email}${matchEmail}`.toLowerCase(),
            this.configService.get<string>('UUID_NAMESPACE'),
        ).toString();
    }
}
