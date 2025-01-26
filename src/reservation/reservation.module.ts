import { Module } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controllers/reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { SeatLock } from './entities/seat-lock.entity';
import { SharedModule } from 'src/core/shared/shared.module';
import { RoomModule } from 'src/room/room.module';
import { SeatLockService } from './services/seat-lock.service';
import { ShowtimeModule } from 'src/showtime/showtime.module';

@Module({
  imports: [
    SharedModule,
    RoomModule,
    ShowtimeModule,
    TypeOrmModule.forFeature([Reservation, SeatLock]),
  ],
  providers: [ReservationService, SeatLockService],
  controllers: [ReservationController],
})
export class ReservationModule {}
