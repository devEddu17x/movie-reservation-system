import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomService } from '../services/room.service';
import { UseAdminGuard } from 'src/core/shared/decorators/protected.decorator';

@Controller('room')
@UseAdminGuard()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Post()
  async createRoom(@Body() roomDTO: CreateRoomDto) {
    return await this.roomService.createRoom(roomDTO);
  }

  @Get(':id')
  async getRoom(@Param('id', ParseIntPipe) roomId: number) {
    const room = await this.roomService.getRoomWithShowtimes(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  @Get('/seats/:id')
  async getRoomSeats(@Param('id', ParseIntPipe) roomId: number) {
    const room = await this.roomService.getRoomSeats(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  @Get()
  async getRooms() {
    return await this.roomService.getRooms();
  }
}
