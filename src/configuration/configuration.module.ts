import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './database.config';
import authConfig from './auth.config';
import appConfig from './app.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
      load: [dbConfig, authConfig, appConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
