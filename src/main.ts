import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  // get configService
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  await app.listen(PORT || 3000);
  console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
