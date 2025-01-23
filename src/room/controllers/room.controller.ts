import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create-room.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/core/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/core/shared/guards/roles.guard';
import { RoleType } from 'src/user/enums/role-type.enum';
import { RoomService } from '../services/room.service';

@Controller('room')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
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

  @Get()
  async getRooms() {
    return await this.roomService.getRooms();
  }
}
