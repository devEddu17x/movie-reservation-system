import { IsString, Length, IsInt, Min, Matches } from 'class-validator';

export class CreateSeatDto {
  @IsString()
  @Length(1, 1)
  @Matches(/\S/, { message: 'Name must not contain only whitespace' })
  columnLetter: string;

  @IsInt()
  @Min(1)
  rowNumber: number;
}
