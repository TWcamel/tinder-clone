import { Module } from '@nestjs/common';
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

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Interest.name, schema: InterestsSchema },
        ]),
        AuthModule,
    ],
    controllers: [UserController, UserInterestsController, PeopleController],
    providers: [InterestsService, UserService, PeopleService],
    exports: [InterestsService, UserService],
})
export class UserModule {}
