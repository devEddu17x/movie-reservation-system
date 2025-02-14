import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDTO } from '../dtos/create-movie.dto';
import { GenreService } from './genre.service';
import { UpdateMovieDTO } from '../dtos/update-movie.dto';
import { MovieStatus } from '../enums/movie-status.enum';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly genreService: GenreService,
  ) {}

  async getMovies(): Promise<Movie[]> {
    try {
      const movies = await this.movieRepository
        .createQueryBuilder('movie')
        .leftJoin('movie.genres', 'genre')
        .where('movie.status = :status', { status: MovieStatus.AVAILABLE })
        .select([
          'movie.id as id',
          'movie.title as title',
          'movie.description as description',
          'movie.posterUrl as posterUrl',
          'movie.duration as duration',
          'movie.year as year',
          'movie.status as status',
          'array_agg(genre.name) as genres',
        ])
        .groupBy('movie.id')
        .getRawMany();

      return movies;
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async getMovie(id: string): Promise<Movie | null> {
    try {
      const movie = await this.movieRepository
        .createQueryBuilder('movie')
        .innerJoinAndSelect('movie.genres', 'genre')
        .innerJoinAndSelect('movie.showtimes', 'showtime')
        .where('movie.id = :id', { id })
        .andWhere('showtime.start_date > NOW()')
        .getOne();

      if (!movie || movie.status !== MovieStatus.AVAILABLE) {
        return null;
      }
      (movie as any).genres = movie.genres.map((genre) => genre.name);

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
