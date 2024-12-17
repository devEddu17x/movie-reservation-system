import {
  Body,
  Controller,
  Get,
  NotFoundException,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get(':id')
  async getMovie(@Param('id', ParseUUIDPipe) id: string) {
    const movie = await this.movieService.getMovie(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async createMovie(@Body() movie: CreateMovieDTO) {
    const createdMovie = await this.movieService.createMovie(movie);
    return {
      message: 'Movie has been created successfully.',
      data: createdMovie,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
