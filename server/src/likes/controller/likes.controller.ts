import {
    Controller,
    Post,
    UseGuards,
    HttpCode,
    Res,
    Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth.service';
import { MatchesService } from 'src/matches/service/matches.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response, Request } from 'express';
import { LikesService } from '../service/likes.service';
import { LikeI, FormatReturnMsgI } from '../models/likes.interface';

@Controller('likes')
export class LikesController {
    constructor(
        private readonly authService: AuthService,
        private readonly likesService: LikesService,
        private readonly matchesService: MatchesService,
    ) {}
    @Post()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async createLikeToken(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        const {
            user,
            recipient,
            isLiked,
        }: { user: string; recipient: string; isLiked: boolean } = req.body;
        try {
            const likeToken: FormatReturnMsgI =
                await this.likesService.userAActsUserB({
                    email: user,
                    matchEmail: recipient,
                    isLiked,
                });
            if (likeToken.isLiked) {
                const isAMatch: boolean =
                    await this.matchesService.checkIsAMatch({
                        email: recipient,
                        matchEmail: user,
                    });
                if (isAMatch) {
                    await this.matchesService.createMatchPair({
                        email: user,
                        matchedEmail: recipient,
                    });
                    return res.send({
                        ok: isAMatch,
                        message: 'its a match!',
                        data: await this.likesService.formatRetMsg(likeToken),
                    });
                } else
                    return res.send({
                        ok: true,
                        data: await this.likesService.formatRetMsg(likeToken),
                    });
            }
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message,
            });
        }
    }
}
