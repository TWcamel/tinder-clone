import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors({
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200,
        origin: process.env.TRUST_SITES.split(', '),
    });
    await app.listen(process.env.SERVER_PORT || 3000, async () => {
        console.log(
            `Server running on ${await app.getUrl()}:${
                process.env.SERVER_PORT || 3000
            }`,
        );
    });
}
bootstrap();
