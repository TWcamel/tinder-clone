import {
    Controller,
    Post,
    Get,
    UseGuards,
    HttpCode,
    Res,
    Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth.service';
import { LikesService } from 'src/likes/service/likes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response, Request } from 'express';
import { MatchesService } from '../service/matches.service';
import { GetIdLikeI } from 'src/likes/models/likes.interface';

@Controller('matches')
export class MatchesController {
    constructor(
        private readonly authService: AuthService,
        private readonly matchesService: MatchesService,
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
            const createMatch = await this.matchesService.createMatchPair({
                email: user,
                matchedEmail: recipient,
            });
            return res.send({
                ok: true,
                data: { createMatch },
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message,
            });
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async checkIsAMatch(
        @Req() req: Request,
        @Res() res: Response,
        { email, matchEmail }: GetIdLikeI,
    ): Promise<Response> {
        try {
            const likeToken: string = await this.likesService.genLikeToken({
                email,
                matchEmail,
            });
            const isAMatch = await this.likesService.findLikeToken({
                id: likeToken,
            });
            return isAMatch
                ? res.send({
                      ok: true,
                      data: "It's a match!",
                  })
                : res.send({
                      erorr: true,
                      data: "It's not a match!",
                  });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message,
            });
        }
    }
}
