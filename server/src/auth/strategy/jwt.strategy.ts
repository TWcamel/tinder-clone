import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: [
                JwtStrategy.extractJwtFromRequest,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ],
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any): Promise<any> {
        return { ...payload.user };
    }

    private static extractJwtFromRequest(req: Request): string | null {
        if (
            req.cookies &&
            'token' in req.cookies &&
            req.cookies.user_token.length > 0
        ) {
            return req.cookies.user_token;
        }
        return null;
    }
}
