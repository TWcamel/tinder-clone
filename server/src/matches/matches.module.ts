import { Module } from '@nestjs/common';
import { MatchesController } from './controller/matches.controller';
import { MatchesService } from './service/matches.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { LikesModule } from 'src/likes/likes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Matches, MatchesSchema } from './models/matches.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Matches.name, schema: MatchesSchema },
        ]),
        AuthModule,
        UserModule,
        LikesModule,
    ],
    controllers: [MatchesController],
    providers: [MatchesService],
    exports: [MatchesService],
})
export class MatchesModule {}
