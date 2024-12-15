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
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string.' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters.' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters.' })
  description?: string;

  @IsNotEmpty({ message: 'Poster URL is required.' })
  @IsUrl({}, { message: 'Poster URL must be a valid URL.' })
  posterUrl: string;

  @IsNotEmpty({ message: 'Duration is required.' })
  @Matches(/^\d+:[0-5]\d$/, {
    message: 'Duration must be in the format mm:ss, for example, "120:00".',
  })
  duration: string;

  @IsNotEmpty({ message: 'Year is required.' })
  @IsInt({ message: 'Year must be an integer.' })
  @Min(1888, { message: 'Year must be 1888 or later.' })
  @Max(new Date().getFullYear(), {
    message: `Year cannot be later than ${new Date().getFullYear()}.`,
  })
  year: number;

  @IsArray({ message: 'Genres must be an array.' })
  @ArrayNotEmpty({ message: 'Genres array cannot be empty.' })
  @IsString({ each: true, message: 'Each genre must be a string.' })
  genres: string[];
}
