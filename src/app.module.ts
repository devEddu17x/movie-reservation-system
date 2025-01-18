import { Module } from '@nestjs/common';
import { ConfigurationModule } from './core/configuration/configuration.module';
import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './core/shared/shared.module';
import { MovieModule } from './movie/movie.module';
import { RoomModule } from './room/room.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { ShowtimeModule } from './showtime/showtime.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    SharedModule,
    MovieModule,
    RoomModule,
    ShowtimeModule,
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'default', ttl: 1000, limit: 3 },
        { name: 'small', ttl: 2000, limit: 6 },
        { name: 'medium', ttl: 10000, limit: 20 },
        { name: 'long', ttl: 60000, limit: 60 },
      ],
      errorMessage: 'Request limit exceeded',
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
