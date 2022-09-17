import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { createDocument } from './swagger/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './vender/core/filter/exception.filter';
import {
    BadRequestException,
    ValidationError,
    ValidationPipe
} from '@nestjs/common';
import { urlencoded, json } from 'express';
// import { Transport } from '@nestjs/microservices';

dotenv.config();
import 'reflect-metadata';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
(async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true
    });
    app.useGlobalFilters(new HttpExceptionFilter());
    const configService = app.get(ConfigService);
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                console.error(JSON.stringify(validationErrors));
                return new BadRequestException(
                    validationErrors.map((error) => ({
                        property: error.property,
                        validators: error.constraints
                    }))
                );
            },
            transform: true
        })
    );
    SwaggerModule.setup('api/v1', app, createDocument(app));
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));
    await app.listen(configService.get().port);
    console.info('SERVER IS RUNNING ON PORT', configService.get().port);
})();
