import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt.guard';
import { FacebookAuthGuard } from './guards/facebook.guard';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION_TIME'),
                },
            }),
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        FacebookStrategy,
        FacebookAuthGuard,
    ],
    exports: [AuthService],
})
export class AuthModule {}
