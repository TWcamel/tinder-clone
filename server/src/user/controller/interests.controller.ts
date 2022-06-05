import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    UseGuards,
    HttpCode,
    Res,
    Req,
    Query,
    HttpStatus,
    Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from '../service/user.service';
import { InterestsService } from '../service/interests.service';
import { AuthService } from 'src/auth/service/auth.service';
import { Response, Request } from 'express';
import { CreateUserInterestsDto } from '../models/dto/CreateInterests.dto';

@Controller('user')
export class UserInterestsController {
    constructor(
        private readonly userService: UserService,
        private readonly interestsService: InterestsService,
        private authService: AuthService,
    ) {}

    @Post('interests')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async createInterests(
        @Res() res: Response,
        @Body() createUserInterestsDto: CreateUserInterestsDto,
    ): Promise<Response> {
        return res.send({
            ok: true,
            data: await this.interestsService.findOneOrCreate(
                createUserInterestsDto,
            ),
        });
    }

    @Post('interests/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateInterests(
        @Res() res: Response,
        @Body() createUserInterestsDto: CreateUserInterestsDto,
        @Param('id') id: string,
    ) {
        return res.send({
            ok: true,
            data: await this.interestsService.update(
                id,
                createUserInterestsDto,
            ),
        });
    }
}
