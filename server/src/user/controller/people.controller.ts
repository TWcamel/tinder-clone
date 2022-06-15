import {
    Controller,
    Get,
    UseGuards,
    HttpCode,
    Res,
    Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PeopleService } from '../service/people.service';
import { Response, Request } from 'express';

@Controller('user')
export class PeopleController {
    constructor(private readonly pplService: PeopleService) {}

    @Get('people/:id')
    @UseGuards(JwtAuthGuard)
    async getPplWithAvatar(@Res() res: Response, @Param('id') id: string) {
        return res.send({
            ok: true,
            data: await this.pplService.findOnePplWithAvatar(id),
        });
    }

    @Get('people')
    async mock(@Res() res: Response) {
        this.pplService.mock();
        return res.send({
            ok: true,
            data: 'ok',
        });
    }
}
