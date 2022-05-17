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
import { MatchesService } from '../service/matches.service';

@Controller('matches')
export class MatchesController {
    constructor(
        private readonly authService: AuthService,
        private readonly matchesService: MatchesService,
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
                message: error.response,
            });
        }
    }
}
