import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GenreService } from '../services/genre.service';
import { CreateGenreDTO } from '../dtos/create-genre.dto';
import { UpdateGenreDTO } from '../dtos/update-genre.dto';
import { UseAdminGuard } from 'src/core/shared/decorators/protected.decorator';

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
  @UseAdminGuard()
  async createGenre(@Body() genre: CreateGenreDTO): Promise<any> {
    const result = await this.genreService.createGenre(genre);
    return {
      message: 'Genre created successfully',
      data: { id: result.identifiers[0].id },
    };
  }

  @Patch(':id')
  @UseAdminGuard()
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
