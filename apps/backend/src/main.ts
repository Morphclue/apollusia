import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

import {AppModule} from './app.module';
import {environment} from './environment';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));

    const config = new DocumentBuilder()
        .setTitle('Apollusia')
        .setDescription('Apollusia API description')
        .setVersion('0.0.0')
        .addTag('apollusia')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document);

    await app.listen(environment.port);
}

bootstrap().then();
