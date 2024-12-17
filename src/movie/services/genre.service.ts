import { HttpException, Injectable } from '@nestjs/common';
import { In, InsertResult, Repository } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGenreDTO } from '../dtos/create-genre.dto';
import { UpdateGenreDTO } from '../dtos/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async getAllGenres(): Promise<Genre[]> {
    return await this.genreRepository.find();
  }

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

  async findGenres(names: string[]): Promise<Genre[] | null> {
    const genres = await this.genreRepository.find({
      where: { name: In(names) },
    });
    return genres;
  }

  async updateGenre(id: number, genre: UpdateGenreDTO): Promise<any> {
    try {
      const result = await this.genreRepository
        .createQueryBuilder()
        .update(Genre)
        .set({ name: genre.name })
        .where('id = :id', { id })
        .execute();
      return result;
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
