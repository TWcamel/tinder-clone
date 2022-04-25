import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    HttpCode,
    Res,
    Req,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../models/dto/CreateUser.dto';
import { LoginUserDto } from '../models/dto/LoginUser.dto';
import { GrantMembershipUserDto } from '../models/dto/GrantMembershipUser.dto';
import { UserI } from '../models/user.interface';
import { UserMembershipI } from '../models/user-membership.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FacebookAuthGuard } from 'src/auth/guards/facebook.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google.guard';
import { Response, Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(200)
    async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
        return await this.userService.create(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() res: Response,
    ): Promise<Response> {
        return this.userService.login(loginUserDto, res);
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
        return this.userService.authenticate(req, res);
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
        return this.userService.authenticate(req, res);
    }

    @Delete('logout')
    async logout(@Res() res: Response): Promise<Response> {
        return this.userService.logout(res);
    }

    @Post('upgrade')
    @HttpCode(200)
    async upgradeMembership(
        @Body() upgradeUserDto: GrantMembershipUserDto,
    ): Promise<UserMembershipI> {
        return await this.userService.changeMembership(
            upgradeUserDto,
            'upgrade',
        );
    }

    @Post('downgrade')
    @HttpCode(200)
    async downgradeMembership(
        @Body() downgradeUserDto: GrantMembershipUserDto,
    ): Promise<UserMembershipI> {
        return await this.userService.changeMembership(
            downgradeUserDto,
            'downgrade',
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<UserI[]> {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserI> {
        return this.userService.findOne(id);
    }
}
