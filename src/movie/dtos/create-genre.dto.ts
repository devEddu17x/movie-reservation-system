import { IsString, Length, Matches } from 'class-validator';

export class CreateGenreDTO {
  @IsString()
  @Length(3, 16)
  @Matches(/\S/, { message: 'Name must not contain only whitespace' })
  name: string;
}
