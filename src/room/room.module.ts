import { Module } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { SharedModule } from 'src/core/shared/shared.module';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { SeatService } from './services/seat.service';
import { Seat } from './entities/seat.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Room, Showtime, Seat])],
  providers: [RoomService, SeatService],
  controllers: [RoomController],
  exports: [RoomService, SeatService],
})
export class RoomModule {}
