import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigurationModule, DatabaseModule, UserModule],
})
export class AppModule {}
