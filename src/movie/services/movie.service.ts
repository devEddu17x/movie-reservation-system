import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDTO } from '../dtos/create-movie.dto';
import { GenreService } from './genre.service';
import { UpdateMovieDTO } from '../dtos/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly genreService: GenreService,
  ) {}

  async createMovie(movie: CreateMovieDTO): Promise<Movie | null> {
    try {
      const genres = await this.genreService.findGenres(movie.genres);
      const result = await this.movieRepository.save({
        ...movie,
        genres,
      });

      return result;
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
  async updateMovie(id: string, movie: UpdateMovieDTO): Promise<any> {
    const genres = await this.genreService.findGenres(movie.genres);

    let newMovie = {};
    if (genres.length === 0) {
      newMovie = { ...movie };
    }
    try {
      const result = await this.movieRepository
        .createQueryBuilder()
        .update(Movie)
        .set(newMovie)
        .where('id = :id', { id })
        .execute();
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', 500);
    }
  }
}
