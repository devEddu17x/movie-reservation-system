import { Module } from '@nestjs/common';
import { ShowtimeService } from './services/showtime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { SharedModule } from 'src/core/shared/shared.module';
import { MovieModule } from 'src/movie/movie.module';
import { ShowtimeController } from './controllers/showtime.controller';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    RoomModule,
    SharedModule,
    MovieModule,
    TypeOrmModule.forFeature([Showtime]),
  ],
  providers: [ShowtimeService],
  controllers: [ShowtimeController],
})
export class ShowtimeModule {}
