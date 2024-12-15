import { Module } from '@nestjs/common';
import { MovieController } from './controllers/movie.controller';
import { SharedModule } from 'src/core/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from './entities/genre.entity';
import { MovieService } from './services/movie.service';
import { GenreService } from './services/genre.service';
import { GenreController } from './controllers/genre.controller';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Movie, Genre])],
  controllers: [MovieController, GenreController],
  providers: [MovieService, GenreService],
})
export class MovieModule {}
