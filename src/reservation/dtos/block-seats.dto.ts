import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayUnique,
  IsUUID,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export class BlockSeatsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ArrayUnique()
  seats: number[];

  @IsUUID()
  showtimeId: string;

  @IsNotEmpty()
  @IsPositive()
  roomId: number;
}
