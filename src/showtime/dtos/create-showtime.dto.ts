import { IsDate, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';
import { IsFutureDate } from 'src/utils/future-dates.custom-validator';
import { HasTimePrecision } from 'src/utils/has-time-precision.custom-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsDate()
  @HasTimePrecision()
  @IsFutureDate(8, {
    message: 'The start date must be at least 8 days in the future.',
  })
  startDate: Date;

  @IsNotEmpty()
  @Min(10)
  @Max(100)
  seatPrice: number;

  @IsNotEmpty()
  @IsUUID('4', { message: 'This field must refer to a valid movie.' })
  movieId: string;
}
