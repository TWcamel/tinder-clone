import { Module } from '@nestjs/common';
import { LikesController } from './controller/likes.controller';
import { LikesService } from './service/likes.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Likes, LikesSchema } from './models/likes.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
        AuthModule,
        UserModule,
    ],
    controllers: [LikesController],
    providers: [LikesService],
    exports: [LikesService],
})
export class LikesModule {}
