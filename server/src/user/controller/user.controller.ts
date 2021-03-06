import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    UseGuards,
    HttpCode,
    Res,
    Req,
    Query,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthService } from 'src/auth/service/auth.service';
import { CreateUserDto } from '../models/dto/CreateUser.dto';
import { LoginUserDto } from '../models/dto/LoginUser.dto';
import { GrantMembershipUserDto } from '../models/dto/GrantMembershipUser.dto';
import {
    UserI,
    UserUpdateInfoI,
    UserUpdatePwdI,
} from '../models/user.interface';
import { UserMembershipI } from '../models/user-membership.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FacebookAuthGuard } from 'src/auth/guards/facebook.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google.guard';
import { Response, Request } from 'express';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private authService: AuthService,
    ) {}

    @Post()
    @HttpCode(200)
    async create(
        @Body() createUserDto: CreateUserDto,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const user: UserI = await this.userService.create(
                res,
                createUserDto,
            );
            return res.send({
                ok: true,
                data: user,
            });
        } catch (error) {
            res.send({
                error: true,
                message: error.response,
            });
        }
    }

    @Post('info')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @Body() newUserInfo: UserUpdateInfoI,
        @Res() res: Response,
    ): Promise<Response> {
        const { email } = newUserInfo;
        try {
            const user: UserI = await this.userService.updateUserInfo(
                email,
                newUserInfo,
            );
            return res.send({
                ok: true,
                data: user,
            });
        } catch (error) {
            res.send({
                error: true,
                message: error.response,
            });
        }
    }

    @Post('password')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updatePassword(
        @Body() newUserPwd: UserUpdatePwdI,
        @Res() res: Response,
    ): Promise<Response> {
        console.log(newUserPwd);
        try {
            const user: UserI = await this.userService.updatePassword(
                res,
                newUserPwd,
            );
            return res.send({
                ok: true,
                data: user,
            });
        } catch (error) {
            res.send({
                error: true,
                message: error.response,
            });
        }
    }

    @Patch('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() res: Response,
        @Req() req: Request,
    ): Promise<Response> {
        const accessToken: string | null = req.headers?.authorization;
        if (
            req.headers?.authorization !== undefined &&
            accessToken.replace('Bearer ', '').length > 0
        ) {
            try {
                const _payload = await this.userService.loginWithJwt(req, res);
                return res.send({
                    ok: true,
                    data: _payload,
                });
            } catch (error) {
                return res.send({
                    error: true,
                    message: error,
                });
            }
        } else {
            return res.send({
                ok: true,
                data: await this.userService.login(loginUserDto, res),
            });
        }
    }

    @Get('login/facebook')
    @UseGuards(FacebookAuthGuard)
    async facebookLogin(): Promise<HttpStatus> {
        return HttpStatus.OK;
    }

    @Get('login/facebook/redirect')
    @UseGuards(FacebookAuthGuard)
    async facebookLoginRedirect(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<object> {
        try {
            const auth: object = await this.userService.authenticate(req, res);
            return auth;
        } catch (error) {
            return {
                error: true,
                message: error.response,
            };
        }
    }

    @Get('login/google')
    @UseGuards(GoogleAuthGuard)
    async googleLogin(): Promise<HttpStatus> {
        return HttpStatus.OK;
    }

    @Get('login/google/redirect')
    @UseGuards(GoogleAuthGuard)
    async googleLoginRedirect(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<object> {
        try {
            const auth: object = await this.userService.authenticate(req, res);
            return auth;
        } catch (error) {
            return {
                error: true,
                message: error.response,
            };
        }
    }

    @Delete('logout')
    async logout(@Res() res: Response): Promise<Response> {
        try {
            const logoutMsg: string = await this.userService.logout(res);
            return res.send({
                ok: true,
                data: logoutMsg,
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response,
            });
        }
    }

    @Post('upgrade')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async upgradeMembership(
        @Req() req: Request,
        @Res() res: Response,
        @Query() upgradeUserDto: GrantMembershipUserDto,
    ): Promise<Response> {
        try {
            const membership: UserMembershipI =
                await this.userService.changeMembership(
                    req,
                    upgradeUserDto,
                    'upgrade',
                );
            return res.send({
                ok: true,
                data: membership,
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response,
            });
        }
    }

    @Post('downgrade')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async downgradeMembership(
        @Req() req: Request,
        @Res() res: Response,
        @Query() downgradeUserDto: GrantMembershipUserDto,
    ): Promise<Response> {
        try {
            const membership: UserMembershipI =
                await this.userService.changeMembership(
                    req,
                    downgradeUserDto,
                    'downgrade',
                );
            return res.send({
                ok: true,
                data: membership,
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('findall')
    async findAll(@Res() res: Response): Promise<Response> {
        try {
            const userList: UserI[] = await this.userService.findAll();
            return res.send({
                ok: true,
                data: userList,
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response,
            });
        }
    }

    @Get('find')
    async findOne(
        @Query() query: { email: string },
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const user: UserI = await this.userService.findOne(query.email);
            return res.send({
                ok: true,
                data: user,
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response,
            });
        }
    }
}
