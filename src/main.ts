import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe());

  // get configService
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  await app.listen(PORT || 3000);
  console.log(`Application is running on: http://localhost:${PORT}`);
  console.log('Happy new year 2025');
}
bootstrap();
