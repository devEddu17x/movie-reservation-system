import { Body, Controller, Post } from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { CreateMovieDTO } from '../dtos/create-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @Post()
  async createMovie(@Body() movie: CreateMovieDTO) {
    return await this.movieService.createMovie(movie);
  }
}
