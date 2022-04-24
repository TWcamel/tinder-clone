import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    console.log(`Now server is listening on port ${process.env.SERVER_PORT}`);
    app.setGlobalPrefix('api');
    await app.listen(process.env.SERVER_PORT || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
