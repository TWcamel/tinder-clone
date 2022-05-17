import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { MatchesModule } from './matches/matches.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URL, {
            retryAttempts: 5,
            retryDelay: 1000,
            maxPoolSize: 350,
            connectionFactory: (connection: any) => {
                return connection;
            },
        }),
        MatchesModule,
        UserModule,
        ChatsModule,
    ],
})
export class AppModule {}
