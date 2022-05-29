import { Module, Inject, forwardRef } from '@nestjs/common';
import { AwsController } from './controller/aws.controller';
import { AwsService } from './service/aws.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from './models/aws.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Avatar.name, schema: AvatarSchema },
        ]),
        AuthModule,
        UserModule,
    ],
    controllers: [AwsController],
    providers: [AwsService],
    exports: [AwsService],
})
export class AwsModule {}
