import { Injectable, Res, Req, HttpStatus } from '@nestjs/common';
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

    async generateJwt(user: UserI): Promise<any> {
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
        return token;
    }

    async getCookieForLogout(@Res() res: Response): Promise<HttpStatus> {
        await res.cookie('service_token', '', {
            expires: new Date(0),
            httpOnly: false,
            secure: false,
        });
        return HttpStatus.OK;
    }

    async clearSessionCookies(@Res() res: Response): Promise<void> {
        res.clearCookie('session');
        res.clearCookie('sid', { path: '/' });
    }

    async verifyJwt(accessToken: string): Promise<any> {
        accessToken = accessToken.replace('Bearer ', '');
        return (await this.jwtService.verify(accessToken)) === null
            ? false
            : this.decodeJwt(accessToken);
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
