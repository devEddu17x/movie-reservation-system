import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieService } from 'src/movie/services/movie.service';
import { CreateShowtimeDto } from '../dtos/create-showtime.dto';
import { durationToMilliseconds } from 'src/utils/duration-to-milliseconds';
import { RoomService } from 'src/room/services/room.service';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    private readonly roomService: RoomService,
    private readonly movieService: MovieService,
  ) {}

  async createShowtime(showtime: CreateShowtimeDto): Promise<Showtime> {
    const [movie, room] = await Promise.all([
      await this.movieService.getMovie(showtime.movieId),
      await this.roomService.getRoom(showtime.roomId),
    ]);

    // check if movie and room exist
    if (!movie) {
      throw new NotFoundException(
        `Movie with id ${showtime.movieId} does not exist.`,
      );
    }
    if (!room) {
      throw new NotFoundException(
        `Room with id ${showtime.roomId} does not exist.`,
      );
    }

    // transform startDate from string to Date object
    showtime.startDate = new Date(showtime.startDate);

    const roomBlockUntil = new Date(room.blockUntil) || new Date();
    const roomAvailable = roomBlockUntil < showtime.startDate;
    if (!roomAvailable) {
      throw new NotFoundException(
        `Room with id ${showtime.roomId} is not available until ${roomBlockUntil}.`,
      );
    }
    try {
      const newShowtime = this.showtimeRepository.create(showtime);
      const movieDuration = durationToMilliseconds(movie.duration);
      newShowtime.endDate = new Date(
        showtime.startDate.getTime() + movieDuration,
      );

      const savedShowtime = await this.showtimeRepository.save(newShowtime);

      await this.roomService.updateRoom(room.id, {
        blockUntil: newShowtime.endDate,
      });

      console.log(savedShowtime);
      return savedShowtime;
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
