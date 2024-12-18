import { Module } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
