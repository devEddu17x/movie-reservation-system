import { Module } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { SharedModule } from 'src/core/shared/shared.module';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { SeatService } from './services/seat.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Room, Showtime])],
  providers: [RoomService, SeatService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
