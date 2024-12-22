import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { RoomType } from '../enums/room-type.enum';
import { CreateSeatDto } from './create-seat.dto';

export class CreateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsEnum(RoomType)
  @IsNotEmpty()
  type: RoomType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  seats?: CreateSeatDto[];
}
