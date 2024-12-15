import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GenreService } from '../services/genre.service';
import { CreateGenreDTO } from '../dtos/create-genre.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/shared/guards/roles.guard';
import { Roles } from 'src/core/shared/decorators/roles.decorator';
import { RoleType } from 'src/user/enums/role-type.enum';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

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
}
