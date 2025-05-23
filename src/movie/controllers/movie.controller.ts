import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { CreateMovieDTO } from '../dtos/create-movie.dto';
import { UpdateMovieDTO } from '../dtos/update-movie.dto';
import { Movie } from '../entities/movie.entity';
import { UseAdminGuard } from 'src/core/shared/decorators/protected.decorator';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getMovies(): Promise<Movie[]> {
    const movies = await this.movieService.getMovies();
    if (movies.length === 0) {
      throw new NotFoundException('No movies found');
    }
    return movies;
  }

  @Get(':id')
  async getMovie(@Param('id', ParseUUIDPipe) id: string): Promise<Movie> {
    const movie = await this.movieService.getMovie(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  @Post()
  @UseAdminGuard()
  async createMovie(@Body() movie: CreateMovieDTO) {
    const createdMovie = await this.movieService.createMovie(movie);
    return {
      message: 'Movie has been created successfully.',
      data: createdMovie,
    };
  }

  @Patch(':id')
  @UseAdminGuard()
  async updateMovie(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() movie: UpdateMovieDTO,
  ) {
    const result = await this.movieService.updateMovie(id, movie);
    if (result.affected === 0) {
      return {
        message: 'Movie not found.',
      };
    }

    return {
      message: 'Movie has been updated successfully.',
    };
  }
}
