import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

  async getMovie(id: string): Promise<Movie> {
    try {
      const movie = await this.movieRepository.findOne({
        where: { id },
        relations: {
          genres: true,
        },
      });
      return movie;
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }

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
    if (movie.genres !== undefined && movie.genres.length !== 0) {
      return await this.updateWithGenres(id, movie);
    }
    return await this.updateNoGenres(id, movie);
  }

  private async updateNoGenres(
    id: string,
    movie: UpdateMovieDTO,
  ): Promise<any> {
    const movieEntity = new Movie();

    for (const key in movie) {
      if (movie.hasOwnProperty(key) && movie[key] !== undefined) {
        movieEntity[key] = movie[key];
      }
    }
    try {
      const result = await this.movieRepository
        .createQueryBuilder()
        .update(Movie)
        .set(movieEntity)
        .where('id = :id', { id })
        .execute();
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Something went wrong', 500);
    }
  }

  private async updateWithGenres(
    id: string,
    movie: UpdateMovieDTO,
  ): Promise<any> {
    const movieRow = await this.movieRepository.findOneBy({ id });
    if (!movieRow) {
      throw new NotFoundException('Movie not found');
    }

    try {
      const newGenres = await this.genreService.findGenres(movie.genres);
      if (newGenres.length !== 0) {
        movieRow.genres = newGenres;
      }

      movieRow.description = movie.description ?? movieRow.description;
      movieRow.duration = movie.duration ?? movieRow.duration;
      movieRow.posterUrl = movie.posterUrl ?? movieRow.posterUrl;
      movieRow.title = movie.title ?? movieRow.title;
      movieRow.year = movie.year ?? movieRow.year;

      return await this.movieRepository.save(movieRow);
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
