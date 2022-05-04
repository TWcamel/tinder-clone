import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    console.log(`Now server is listening on port ${process.env.SERVER_PORT}`);
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors({ credentials: true, origin: process.env.FRONTEND_URL });
    await app.listen(process.env.SERVER_PORT || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
