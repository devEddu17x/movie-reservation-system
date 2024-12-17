import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GenreService } from '../services/genre.service';
import { CreateGenreDTO } from '../dtos/create-genre.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/shared/guards/roles.guard';
import { Roles } from 'src/core/shared/decorators/roles.decorator';
import { RoleType } from 'src/user/enums/role-type.enum';
import { UpdateGenreDTO } from '../dtos/update-genre.dto';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getAllGenres() {
    const genres = await this.genreService.getAllGenres();
    if (genres.length === 0) {
      return {
        message: 'No genres found',
      };
    }
    return genres;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async createGenre(@Body() genre: CreateGenreDTO): Promise<any> {
    const result = await this.genreService.createGenre(genre);
    return {
      message: 'Genre created successfully',
      data: { id: result.identifiers[0].id },
    };
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async updateGenre(
    @Param('id', ParseIntPipe) id: number,
    @Body() genre: UpdateGenreDTO,
  ) {
    const result = await this.genreService.updateGenre(id, genre);
    if (result.affected === 0) {
      return {
        message: 'Genre not found',
      };
    }
    return {
      message: 'Genre updated successfully',
    };
  }
}
