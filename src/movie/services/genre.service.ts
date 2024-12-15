import { HttpException, Injectable } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGenreDTO } from '../dtos/create-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async createGenre(genreDTO: CreateGenreDTO): Promise<InsertResult> {
    try {
      const result = await this.genreRepository.insert(genreDTO);
      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          `Genre with name <<${genreDTO.name}>> already exists`,
          409,
        );
      }
    }
  }
}
