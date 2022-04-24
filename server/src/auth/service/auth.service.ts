import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/models/user.interface';
import { TokenI } from '../interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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
}
