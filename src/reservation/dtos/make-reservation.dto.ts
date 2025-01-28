import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class MakeReservationDTO {
  @IsNotEmpty()
  @IsPositive()
  roomId: number;
  @IsNotEmpty()
  @IsUUID()
  showtimeId: string;
}
