import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './database.config';
import authConfig from './auth.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
      load: [dbConfig, authConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
