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
import { RequestWithUserI } from 'src/auth/interfaces/requestWithUser.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private authService: AuthService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email } = createUserDto;
        const isEmailExists: boolean = await this.mailExists(email);
        if (!isEmailExists) {
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
                return createUserDto;
            } else {
                throw new HttpException(
                    'Service unavailable',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        } else {
            throw new HttpException(
                'Email already exists',
                HttpStatus.CONFLICT,
            );
        }
    }

    async login(
        loginUserDto: LoginUserDto,
        @Res() res: Response,
    ): Promise<Response> {
        const user: UserI = await this.findUserByEmail(loginUserDto.email);
        if (user) {
            const isPasswordValid: boolean = await this.validatePassword(
                loginUserDto.password,
                user.password,
            );
            if (isPasswordValid) {
                const cookie: string =
                    await this.authService.getCookieWithJwtToken(user.id);
                res.setHeader('Set-Cookie', cookie);
                user.password = undefined;
                return res.send({ ok: true, data: user });
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

        const payload: any = req.user;
        const { facebookId, googleId } = payload.user;

        res.setHeader(
            'Set-Cookie',
            await this.authService.getCookieWithJwtToken(
                googleId || facebookId,
            ),
        );

        await this.findOrCreate(req);

        return res.send({
            ok: true,
            statusCode: HttpStatus.OK,
            data: req.user,
        });
    }

    async logout(@Res() res: Response): Promise<Response> {
        const cookie: string = await this.authService.getCookieForLogout();
        await this.authService.clearSessionCookies(res);
        res.setHeader('Set-Cookie', cookie);
        return res.send({ ok: true, message: 'Logout successful' });
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

    private async findOrCreate(@Req() req: Request): Promise<UserI> | null {
        const { user }: any = req.user;
        const { email, googleId, facebookId }: any = user;

        const isEmailExists: boolean = await this.mailExists(email);

        if (!isEmailExists) {
            await new this.userModel({ email }).save();
        }

        const newUser: any = await this.updateUserAuthId(
            email,
            googleId || facebookId,
            googleId ? 'google' : 'facebook',
        );

        return newUser;
    }

    async changeMembership(
        @Req() req: Request,
        _user: UserMembershipI,
        membershipType: string,
    ): Promise<UserMembershipI> {
        const { email }: any = _user;
        const user = this.findOneByEmail(email);

        if (user && membershipType && (await this.matchUserEmail(req, email))) {
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

    async matchUserEmail(
        @Req() req: Request,
        _email: string,
    ): Promise<boolean> {
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

    async findOne(id: string): Promise<User> {
        return this.userModel.findOne({ _id: id }).exec();
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

    private async validatePassword(
        password: string,
        storedPassword: string,
    ): Promise<boolean> {
        return this.authService.comparePasswords(password, storedPassword);
    }

    private async findUserByEmail(email: string): Promise<UserI> {
        return this.userModel.findOne({ email }).exec();
    }

    private async mailExists(email: string): Promise<boolean> {
        const user = await this.userModel.findOne({ email: email }).exec();
        return user === null ? false : true;
    }
}
