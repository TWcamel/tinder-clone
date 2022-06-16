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
import { ChatI, ReceivedMessageI } from '../models/chats.interface';

@Controller('chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
        private authService: AuthService,
    ) {}

    @Post()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateOrCreateChat(
        @Res() res: Response,
        @Req() req: Request,
    ): Promise<Response<ChatI>> {
        const { sender, reciever, message }: ReceivedMessageI = req.body;
        try {
            const chat = await this.chatsService.updateOrCreateChat({
                sender,
                reciever,
                message,
                updateAt: new Date(),
            });
            if (chat)
                return res.send({
                    ok: true,
                    data: chat,
                });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message,
            });
        }
    }

    @Post('/histories')
    @UseGuards(JwtAuthGuard)
    async getChatsHistory(
        @Res() res: Response,
        @Req() req: Request,
    ): Promise<Response<ChatI[]>> {
        const { sender, reciever }: ReceivedMessageI = req.body;
        try {
            const chats = await this.chatsService.getChatsHistory({
                sender,
                reciever,
                fetch: false,
            });
            if (chats)
                return res.send({
                    ok: true,
                    data: chats,
                });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message,
            });
        }
    }

    @Post('/history')
    @UseGuards(JwtAuthGuard)
    async fetchChats(
        @Res() res: Response,
        @Req() req: Request,
    ): Promise<Response<ChatI[]>> {
        const { sender, reciever }: ReceivedMessageI = req.body;
        try {
            const chats = await this.chatsService.getChatsHistory({
                sender,
                reciever,
                fetch: true,
            });

            if (chats)
                return res.send({
                    ok: true,
                    data: chats,
                });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message,
            });
        }
    }
}
