import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class MakeReservationDTO {
  @IsNotEmpty()
  @IsPositive()
  roomId: number;
  @IsNotEmpty()
  @IsUUID()
  showtimeId: string;
  @IsNotEmpty({ each: true })
  @IsPositive({ each: true })
  seats: number[];
}
