import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Avatar, AvatarDocument } from '../models/aws.schemas';
import DateTime from 'src/utils/time.utils';
import * as AwsI from '../models/aws.interface';
import { CreateAvatarsDto } from '../models/dto/CreateAvatars.dto';
import { apigwPutRequest, apigwGetRequest } from '../../utils/request.utils';

@Injectable()
export class AwsService {
    constructor(
        @InjectModel(Avatar.name) private AvatarModel: Model<AvatarDocument>,
        private readonly configService: ConfigService,
    ) {}
    async saveToS3Bucket({ image, img_name }: AwsI.S3BucketI): Promise<string> {
        const url = this.configService.get<string>('S3_URL');
        if (await apigwPutRequest(`${url}/${img_name}`, image))
            return Promise.resolve('OK');
        else
            return Promise.reject(
                new HttpException(
                    'Error saving image to S3 bucket',
                    HttpStatus.BAD_REQUEST,
                ),
            );
    }

    async saveToMongoDb({
        url,
        email,
    }: CreateAvatarsDto): Promise<AvatarDocument> {
        const avatar = {
            url,
            email,
            createdAt: DateTime.getCurrentTime(),
        };
        return await new this.AvatarModel(avatar).save();
    }

    async getS3BucketFromMongoDb(email: string): Promise<AwsI.AvatarsI> {
        const avatars: any = await this.AvatarModel.find({
            email,
        }).exec();
        return avatars;
    }
}
