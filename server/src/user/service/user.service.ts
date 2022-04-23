import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.schemas';
import { CreateUserDto } from '../models/dto/CreateUser.dto';
import { AuthService } from 'src/auth/service/auth.service';
import { LoginUserDto } from '../models/dto/LoginUser.dto';
import { UserI } from '../models/user.interface';
import { Response } from 'express';

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
        @Res() response: Response,
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
                response.setHeader('Set-Cookie', cookie);
                user.password = undefined;
                return response.send({ok: true, data: user});
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

    async logout(@Res() response: Response): Promise<Response> {
        const cookie: string = await this.authService.getCookieForLogout();
        response.setHeader('Set-Cookie', cookie);
        return response.send({ ok: true, message: 'Logout successful' });
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel.findOne({ _id: id }).exec();
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email }).exec();
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
        const user = await this.userModel.findOne({ email }).exec();
        return user ? true : false;
    }
}
