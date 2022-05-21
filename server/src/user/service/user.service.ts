import { Model } from 'mongoose';
import {
    Injectable,
    HttpException,
    HttpStatus,
    Res,
    Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.schemas';
import { CreateUserDto } from '../models/dto/CreateUser.dto';
import { AuthService } from 'src/auth/service/auth.service';
import { LoginUserDto } from '../models/dto/LoginUser.dto';
import { UserI } from '../models/user.interface';
import { UserMembershipI } from '../models/user-membership.interface';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    async create(
        @Res() res: Response,
        createUserDto: CreateUserDto,
    ): Promise<User> {
        const { email } = createUserDto;

        const isEmailExists: boolean = await this.mailExists(email);
        if (isEmailExists) {
            throw new HttpException(
                'Email already exists',
                HttpStatus.CONFLICT,
            );
        }

        try {
            const hashedPassword: string = await this.authService.hashPassword(
                createUserDto.password,
            );
            const hashedCreateUserDto = {
                ...createUserDto,
                password: hashedPassword,
            };
            const savedUser = new this.userModel(hashedCreateUserDto).save();
            if (savedUser) {
                createUserDto.password = undefined;
                const token: string = await this.authService.generateJwt(
                    createUserDto,
                );
                res.cookie('service_token', token, {
                    httpOnly: false,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    domain: this.configService.get('FRONTEND_DOMAIN'),
                });

                return createUserDto;
            } else {
                throw new HttpException(
                    'Service unavailable',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        } catch (error) {
            throw new HttpException(
                'Service unavailable',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async login(
        loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<UserI> {
        const user: UserI = await this.findUserByEmail(loginUserDto.email);
        if (user) {
            const isPasswordValid: boolean = await this.validatePassword(
                loginUserDto.password,
                user.password,
            );
            if (isPasswordValid) {
                const payload = { name: user.name, email: user.email };
                const token: string = await this.authService.generateJwt(
                    payload,
                );
                user.password = undefined;
                res.cookie('service_token', token, {
                    httpOnly: false,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    domain: this.configService.get('FRONTEND_DOMAIN'),
                });
                return user;
            } else {
                throw new HttpException(
                    'Invalid password',
                    HttpStatus.UNAUTHORIZED,
                );
            }
        } else {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    async loginWithJwt(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<any> {
        const accessToken: string | null = req.headers?.authorization;
        const payload = await this.authService.verifyJwt(accessToken);
        return accessToken && payload
            ? { name: payload.user.name, email: payload.user.email }
            : null;
    }

    async authenticate(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<object> {
        if (!req.user) {
            return {
                error: true,
                statusCode: HttpStatus.UNAUTHORIZED,
                data: 'User not found',
            };
        }

        const user = await this.findOrCreate(req);

        const token = await this.authService.generateJwt(user);

        await this.authService.setCookieJwt(res, token);

        return res.send({
            ok: true,
            data: req.user,
        });
    }

    async logout(@Res() res: Response): Promise<string> {
        const ok: HttpStatus = await this.authService.getCookieForLogout(res);
        await this.authService.clearSessionCookies(res);
        return ok === HttpStatus.OK ? 'Logout successful' : 'Logout failed';
    }

    private async findOrCreate(@Req() req: Request): Promise<UserI> | null {
        const { user }: any = req.user;
        const { email, googleId, facebookId, firstName }: any = user;

        const isEmailExists: boolean = await this.mailExists(email);

        let newUser: UserI = null;

        if (!isEmailExists) {
            newUser = await new this.userModel({
                email,
                googleId,
                facebookId,
                name: firstName,
            }).save();
        } else {
            newUser = await this.updateUserAuthId(
                email,
                googleId || facebookId,
                googleId ? 'google' : 'facebook',
            );
        }

        return newUser;
    }

    private async updateUserAuthId(
        _email: string,
        _authId: string,
        _authType: string,
    ): Promise<UserI> {
        const authId =
            _authType === 'google'
                ? { googleId: _authId }
                : { facebookId: _authId };
        const user = this.userModel
            .findOneAndUpdate({ email: _email }, authId, { new: true })
            .exec();
        return user;
    }

    async changeMembership(
        @Req() req: Request,
        _user: UserMembershipI,
        membershipType: string,
    ): Promise<UserMembershipI> {
        const { email }: any = _user;
        const user = this.findOneByEmail(email);

        if (user && membershipType && (await this.matchReqEmail(req, email))) {
            const membershipUser = {
                membershipType: membershipType === 'upgrade' ? 'VIP' : 'FREE',
            };
            const newMembershipUser: UserMembershipI =
                await this.userModel.findOneAndUpdate(
                    { email },
                    membershipUser,
                    { new: true },
                );

            return newMembershipUser;
        } else {
            throw new HttpException(
                'Please check your input email and check you are logged in',
                HttpStatus.NOT_ACCEPTABLE,
            );
        }
    }

    async matchReqEmail(@Req() req: Request, _email: string): Promise<boolean> {
        const token: string = await this.authService.extractJwtFromRequest(req);

        const { userId } = await this.authService.decodeJwt(token);

        const { email }: UserI = await this.userModel
            .findOne({ _id: userId })
            .exec();

        return email === _email ? true : false;
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(email: string): Promise<any | HttpException> {
        const user: any = await this.userModel.findOne({ email }).exec();
        if (user) return { email: user.email, name: user.name };
        else throw new HttpException('Email not exists', HttpStatus.NOT_FOUND);
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email: email }).exec();
    }

    async delete(id: string) {
        const deletedUser = await this.userModel
            .findByIdAndRemove({ _id: id })
            .exec();
        return deletedUser;
    }

    async validatePassword(
        password: string,
        storedPassword: string,
    ): Promise<boolean> {
        return this.authService.comparePasswords(password, storedPassword);
    }

    async findUserByEmail(email: string): Promise<UserI> {
        return this.userModel.findOne({ email }).exec();
    }

    async mailExists(email: string): Promise<boolean> {
        const user = await this.userModel.findOne({ email: email }).exec();
        return user === null ? false : true;
    }

    async mailsExists(emails: string[]): Promise<boolean> {
        const users = await this.userModel
            .find({ email: { $in: emails } })
            .exec();
        return users.length === emails.length ? true : false;
    }
}
