import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { RoomType } from '../enums/room-type.enum';
import { CreateSeatDto } from './create-seat.dto';

export class CreateRoomDto {
  @IsNumber()
  @Min(1)
  id?: number;

  @IsEnum(RoomType)
  @IsNotEmpty()
  type: RoomType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  seats?: CreateSeatDto[];
}
