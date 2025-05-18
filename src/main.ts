import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe());

  // get configService
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.enableCors({
    origin: true, // this must be changed to the frontend domain
    credentials: true,
  });
  app.use(morgan('dev'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Movie Reservation System API')
    .setDescription('API documentation for the Movie Reservation System')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory());

  await app.listen(PORT || 3000);
  console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
