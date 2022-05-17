import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Param,
    Post,
    UseGuards,
    HttpCode,
    Res,
    Req,
    Query,
    HttpStatus,
} from '@nestjs/common';
import { ChatsService } from '../service/chats.service';
import { AuthService } from 'src/auth/service/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response, Request } from 'express';

@Controller('chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
        private authService: AuthService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('findall')
    async createMatch(@Res() res: Response): Promise<Response> {
        try {
            return res.send({
                ok: true,
                data: {},
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response,
            });
        }
    }
}
