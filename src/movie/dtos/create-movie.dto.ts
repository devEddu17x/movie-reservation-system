import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMovieDTO {
  @ApiProperty({
    description: 'Movie title',
    example: 'Inception',
    required: true,
    maxLength: 255,
    minLength: 1,
  })
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string.' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters.' })
  title: string;

  @ApiProperty({
    description: 'Movie description',
    example: 'A mind-bending thriller',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters.' })
  description?: string;

  @ApiProperty({
    description: 'Movie poster URL',
    example: 'https://example.com/poster.jpg',
    required: true,
    format: 'url',
  })
  @IsNotEmpty({ message: 'Poster URL is required.' })
  @IsUrl({}, { message: 'Poster URL must be a valid URL.' })
  posterUrl: string;

  @ApiProperty({
    description: 'Movie duration in mm:ss format',
    example: '120:00',
    required: true,
  })
  @IsNotEmpty({ message: 'Duration is required.' })
  @IsString({ message: 'Duration must be a string.' })
  @Matches(/^\d+:[0-5]\d$/, {
    message: 'Duration must be in the format mm:ss, for example, "120:00".',
  })
  duration: string;

  @ApiProperty({
    description: 'Movie release year',
    example: 2010,
    required: true,
    minimum: 1888,
  })
  @IsNotEmpty({ message: 'Year is required.' })
  @IsInt({ message: 'Year must be an integer.' })
  @Min(1888, { message: 'Year must be 1888 or later.' })
  @Max(new Date().getFullYear(), {
    message: `Year cannot be later than ${new Date().getFullYear()}.`,
  })
  year: number;

  @ApiProperty({
    description: 'Movie genres',
    example: ['Action', 'Sci-Fi'],
    required: true,
    type: [String],
  })
  @IsArray({ message: 'Genres must be an array.' })
  @ArrayNotEmpty({ message: 'Genres array cannot be empty.' })
  @IsString({ each: true, message: 'Each genre must be a string.' })
  genres: string[];
}
