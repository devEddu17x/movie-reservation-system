import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CreateGenreDTO {
  @ApiProperty({
    description: 'Genre name',
    example: 'Action',
    required: true,
    maxLength: 16,
    minLength: 3,
  })
  @IsString()
  @Length(3, 16)
  @Matches(/\S/, { message: 'Name must not contain only whitespace' })
  name: string;
}
