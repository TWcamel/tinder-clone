import {
    Controller,
    Post,
    UseGuards,
    HttpCode,
    Res,
    Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response, Request } from 'express';
import { LikesService } from '../service/likes.service';

@Controller('likes')
export class LikesController {
    constructor(
        private readonly authService: AuthService,
        private readonly likesService: LikesService,
    ) {}
    @Post()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async createMatchPair(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        const { user, recipient }: { user: string; recipient: string } =
            req.body;
        try {
            const likeToken = await this.likesService.userALikesUserB({
                email: user,
                matchedEmail: recipient,
            });
            return res.send({
                ok: true,
                data: { likeToken },
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message || 'Duplicate like',
            });
        }
    }
}
