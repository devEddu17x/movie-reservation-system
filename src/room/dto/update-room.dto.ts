import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDTO extends PartialType(CreateRoomDto) {
  blockUntil?: Date;
}
