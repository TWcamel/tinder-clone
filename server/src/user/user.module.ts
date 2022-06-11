import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './service/user.service';
import { InterestsService } from './service/interests.service';
import { PeopleService } from './service/people.service';
import { PeopleController } from './controller/people.controller';
import { UserController } from './controller/user.controller';
import { UserInterestsController } from './controller/interests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.schemas';
import { Interest, InterestsSchema } from './models/user-interests.schemas';
import { AuthModule } from 'src/auth/auth.module';
import { Matches, MatchesSchema } from 'src/matches/models/matches.schemas';
import { Likes, LikesSchema } from 'src/likes/models/likes.schemas';
import {
    NextTimeToMatch,
    NextTimeToMatchSchema,
} from 'src/matches/models/next.time.match.schemas';
import { MatchesModule } from 'src/matches/matches.module';
import { MatchesService } from 'src/matches/service/matches.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Interest.name, schema: InterestsSchema },
        ]),
        MongooseModule.forFeature([
            { name: Matches.name, schema: MatchesSchema },
        ]),
        MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
        MongooseModule.forFeature([
            { name: NextTimeToMatch.name, schema: NextTimeToMatchSchema },
        ]),
        AuthModule,
    ],
    controllers: [UserController, UserInterestsController, PeopleController],
    providers: [InterestsService, UserService, PeopleService],
    exports: [InterestsService, UserService],
})
export class UserModule {}
