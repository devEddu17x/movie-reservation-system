import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { CreateMovieDTO } from '../dtos/create-movie.dto';
import { Roles } from 'src/core/shared/decorators/roles.decorator';
import { RoleType } from 'src/user/enums/role-type.enum';
import { RolesGuard } from 'src/core/shared/guards/roles.guard';
import { UpdateMovieDTO } from '../dtos/update-movie.dto';

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

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
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
