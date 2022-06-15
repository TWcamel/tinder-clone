import {
    Controller,
    Post,
    Get,
    Param,
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
import * as LikesI from 'src/likes/models/likes.interface';

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
                message: error.response || error._message || error,
            });
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async checkIsAMatch(
        @Req() req: Request,
        @Res() res: Response,
        { email, matchEmail }: LikesI.GetIdLikeI,
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

    @Get('/:id')
    async getMatches(
        @Req() req: Request,
        @Res() res: Response,
        @Param('id') id: string,
    ): Promise<Response> {
        try {
            return res.send({
                ok: true,
                data: await this.matchesService.getMatches({ email: id }),
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message,
            });
        }
    }

    @Get('/nextSwipe/:id')
    async getNextSwipe(
        @Req() req: Request,
        @Res() res: Response,
        @Param('id') id: string,
    ): Promise<Response> {
        try {
            return res.send({
                ok: true,
                data: await this.matchesService.getNextSwipe({ email: id }),
            });
        } catch (error) {
            return res.send({
                error: true,
                message: error.response || error._message,
            });
        }
    }

}
