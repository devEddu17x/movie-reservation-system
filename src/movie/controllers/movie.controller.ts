import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { CreateMovieDTO } from '../dtos/create-movie.dto';
import { Roles } from 'src/core/shared/decorators/roles.decorator';
import { RoleType } from 'src/user/enums/role-type.enum';
import { RolesGuard } from 'src/core/shared/guards/roles.guard';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  async createMovie(@Body() movie: CreateMovieDTO) {
    const createdMovie = await this.movieService.createMovie(movie);
    return {
      message: 'Movie has been created successfully.',
      data: createdMovie,
    };
  }
}
