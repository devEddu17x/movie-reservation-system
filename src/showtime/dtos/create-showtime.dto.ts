import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';
import { IsFutureDate } from 'src/utils/future-dates.custom-validator';
import { HasTimePrecision } from 'src/utils/has-time-precision.custom-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @HasTimePrecision()
  @IsFutureDate(8, {
    message: 'The startDate must be at least 8 hours in the future.',
  })
  startDate: Date;

  @IsNotEmpty()
  @Min(10)
  @Max(100)
  seatPrice: number;

  @IsNotEmpty()
  @IsUUID()
  movieId: string;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
