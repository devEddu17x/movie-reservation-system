import { Module } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controllers/reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { SeatLock } from './entities/seat-lock.entity';
import { SharedModule } from 'src/core/shared/shared.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    SharedModule,
    RoomModule,
    TypeOrmModule.forFeature([Reservation, SeatLock]),
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
