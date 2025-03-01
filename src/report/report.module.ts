import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { User } from 'src/user/entities/user.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Room } from 'src/room/entities/room.entity';
import { Seat } from 'src/room/entities/seat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Movie, User, Showtime, Room, Seat]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
