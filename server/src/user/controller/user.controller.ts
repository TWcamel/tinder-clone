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
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../models/dto/CreateUser.dto';
import { LoginUserDto } from '../models/dto/LoginUser.dto';
import { UserI } from '../models/user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
        return await this.userService.create(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() response: Response,
    ): Promise<Response> {
        return this.userService.login(loginUserDto, response);
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

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserI> {
        return this.userService.findOne(id);
    }
}
