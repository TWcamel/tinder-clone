import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get('FACEBOOK_APP_ID'),
            clientSecret: configService.get('FACEBOOK_APP_SECRET'),
            callbackURL: configService.get('FACEBOOK_CALLBACK_URL'),
            scope: 'email',
            profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;
        const user = {
            facebookId: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            avatar: photos[0].value,
        };
        const payload = {
            user,
            accessToken,
        };

        done(null, payload);
    }
}
