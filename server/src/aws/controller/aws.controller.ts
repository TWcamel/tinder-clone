import {
    Controller,
    Put,
    UseGuards,
    HttpCode,
    Res,
    Req,
    Body,
    Post,
    Query,
    Get,
} from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth.service';
import { UserService } from 'src/user/service/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response, Request } from 'express';
import { AwsService } from '../service/aws.service';
import * as AwsI from '../models/aws.interface';
import { ConfigService } from '@nestjs/config';

@Controller('aws')
export class AwsController {
    constructor(
        private readonly authService: AuthService,
        private readonly awsService: AwsService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}
    @Post('s3')
    @HttpCode(200)
    async s3BucketStorage(
        @Req() req: Request,
        @Res() res: Response,
        @Body() _data: AwsI.S3BucketI,
    ): Promise<Response> {
        const { email } = await this.userService.findOne(_data.user);
        if ((_data.user = email)) {
            this.awsService.saveToS3Bucket(_data);
            return res.send({
                ok: true,
                data: await this.awsService.saveToMongoDb({
                    url: _data.url,
                    email,
                }),
            });
        }
        return res.send({
            error: true,
            data: 'Error while uploading to S3 Bucket',
        });
    }

    @Get('s3')
    @UseGuards(JwtAuthGuard)
    async s3BucketGet(
        @Req() req: Request,
        @Res() res: Response,
        @Query() { user_email }: { user_email: any },
    ): Promise<Response> {
        const avatars: any = await this.awsService.getS3BucketFromMongoDb(
            user_email,
        );
        return res.send({
            ok: true,
            data: avatars.map((avatar: AwsI.AvatarsI) => {
                return {
                    url: avatar?.url,
                    updateAt: avatar?.updateAt,
                };
            }),
        });
    }
}
