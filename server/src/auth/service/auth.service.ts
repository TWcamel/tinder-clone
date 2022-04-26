import { Injectable, Res, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/models/user.interface';
import { TokenI } from '../interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateJwt(user: UserI): Promise<string> {
        return await this.jwtService.signAsync({ user });
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    async comparePasswords(
        password: string,
        storedPasswordHash: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, storedPasswordHash);
    }

    async getCookieWithJwtToken(userId: number): Promise<string> {
        const payload: TokenI = { userId: userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
            'JWT_EXPIRATION_TIME',
        )}`;
    }

    async getCookieForLogout(): Promise<string> {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    async clearSessionCookies(@Res() res: Response): Promise<void> {
        res.clearCookie('session');
        res.clearCookie('sid', { path: '/' });
    }

    async getAuthPayload(token: string): Promise<object> {
        return this.jwtService.verify(token);
    }

    async decodeJwt(token: string): Promise<any> {
        return this.jwtService.decode(token);
    }

    async extractJwtFromRequest(req: Request): Promise<any> {
        if ('authorization' in req.headers) {
            return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        }
        return null;
    }
}
