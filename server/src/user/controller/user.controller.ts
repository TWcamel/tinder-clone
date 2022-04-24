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
import { UserI } from '../models/user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FacebookAuthGuard } from 'src/auth/guards/facebook.guard';
import { Response, Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
        return await this.userService.create(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async jwtLogin(
        @Body() loginUserDto: LoginUserDto,
        @Res() response: Response,
    ): Promise<Response> {
        return this.userService.jwtLogin(loginUserDto, response);
    }

    @Get('login/facebook')
    @UseGuards(FacebookAuthGuard)
    @HttpCode(200)
    async facebookLogin(): Promise<HttpStatus> {
        return HttpStatus.OK;
    }

    @Get('login/facebook/redirect')
    @UseGuards(FacebookAuthGuard)
    @HttpCode(200)
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        return { ok: true, statusCode: HttpStatus.OK, data: req.user };
    }

    @Delete('logout')
    @HttpCode(200)
    async logout(@Res() response: Response): Promise<Response> {
        return this.userService.logout(response);
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
