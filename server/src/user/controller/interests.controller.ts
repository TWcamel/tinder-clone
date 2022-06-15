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
    ): Promise<Response> {
        let updatedInterests = await this.interestsService.update(
            id,
            createUserInterestsDto,
        );
        if (!updatedInterests) {
            const formattedInterestsDto = {
                id,
                ...createUserInterestsDto,
            };
            updatedInterests = await this.interestsService.findOneOrCreate(
                formattedInterestsDto,
            );
        }
        return res.send({
            ok: true,
            data: updatedInterests,
        });
    }

    @Get('interests/:id')
    @UseGuards(JwtAuthGuard)
    async getInterests(
        @Res() res: Response,
        @Param('id') id: string,
    ): Promise<Response> {
        return res.send({
            ok: true,
            data: await this.interestsService.findOne(id),
        });
    }

    @Get('interests')
    async mock(@Res() res: Response): Promise<Response> {
        await this.interestsService.mock();
        return res.send({
            ok: true,
            data: 'ok',
        });
    }
}
