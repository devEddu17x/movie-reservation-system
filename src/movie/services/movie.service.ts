import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDTO } from '../dtos/create-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async createMovie(movie: CreateMovieDTO): Promise<InsertResult | null> {
    console.log(movie);
    return null;
    // future implementation of creating a movie
  }
}
