import { Module } from '@nestjs/common';
import { MatchesController } from './controller/matches.controller';
import { MatchesService } from './service/matches.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { LikesModule } from 'src/likes/likes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Matches, MatchesSchema } from './models/matches.schemas';
import {
    NextTimeToMatch,
    NextTimeToMatchSchema,
} from './models/next.time.match.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Matches.name, schema: MatchesSchema },
        ]),
        MongooseModule.forFeature([
            { name: NextTimeToMatch.name, schema: NextTimeToMatchSchema },
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
