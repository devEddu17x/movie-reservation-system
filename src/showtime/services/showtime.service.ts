import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, MoreThanOrEqual, Repository } from 'typeorm';
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

  /**
   *
   * ENTER METHOD TO READ DOCUMENTATION OTHERWISE YOU WILL NOT UNDERSTAND THE DOCS FROM TEXT EDITOR
   *
   * Generates a new showtime in a specific room for a selected movie. Before saving,
   * it performs various checks to ensure that the showtime does not overlap with
   * any existing showtimes in the room:
   *
   * 1. Existing start within new showtime:
   *
   *    newShowtime.startDate         newShowtime.endDate
   *             |--------------------------|
   *                    db.startDate               db.endDate
   *                        |--------------------------|
   *
   *    If an existing showtime's start date (db.startDate) falls within the newShowtime
   *    duration, it means they overlap.
   *
   * 2. Existing end within new showtime:
   *
   *            newShowtime.startDate         newShowtime.endDate
   *                       |--------------------------|
   *    db.startDate                  db.endDate
   *          |--------------------------|
   *
   *    If an existing showtime's end date (db.endDate) falls within the newShowtime
   *    duration, it means they overlap.
   *
   *    Combining cases (1) and (2) also covers the scenario where the new showtime
   *    completely wraps around an existing showtime:
   *
   *       newShowtime.startDate                newShowtime.endDate
   *             |---------------------------------------|
   *                  db.startDate          db.endDate
   *                    |--------------------------|
   *
   *    This means the new showtime starts before and ends after the existing showtime,
   *    causing a clash.
   *
   * 3. New showtime wrapped by existing showtime:
   *
   *          newShowtime.startDate   newShowtime.endDate
   *                 |--------------------------|
   *   db.startDate                                       db.endDate
   *     |--------------------------------------------------------|
   *
   *
   *    If the new showtime starts after db.startDate and ends before db.endDate,
   *    then it is enveloped entirely by an existing showtime, indicating a time
   *    conflict.
   *
   * If any of these conditions are met, the room is considered occupied, and the
   * new showtime cannot be created.
   */
  async createShowtime(showtime: CreateShowtimeDto): Promise<Showtime> {
    const [movie, room] = await Promise.all([
      await this.movieService.getMovie(showtime.movieId),
      await this.roomService.getRoomWithShowtimes(showtime.roomId),
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

    // transform startDate from timestamp string to Date object
    showtime.startDate = new Date(showtime.startDate);

    // this only copyes seatPrice, startDate and endDate, room and movie are missing
    const newShowtime = this.showtimeRepository.create(showtime);
    const movieDuration = durationToMilliseconds(movie.duration);

    newShowtime.endDate = new Date(
      showtime.startDate.getTime() + movieDuration,
    );

    const showtimesInRoom = await this.showtimeRepository
      .createQueryBuilder('showtime')
      .where('showtime.room_id = :roomId', { roomId: room.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('showtime.start_date BETWEEN :startDate AND :endDate', {
            startDate: newShowtime.startDate,
            endDate: newShowtime.endDate,
          })
            .orWhere('showtime.end_date BETWEEN :startDate AND :endDate', {
              startDate: newShowtime.startDate,
              endDate: newShowtime.endDate,
            })
            .orWhere(
              'showtime.start_date <= :startDate AND showtime.end_date >= :endDate',
              {
                startDate: newShowtime.startDate,
                endDate: newShowtime.endDate,
              },
            );
        }),
      )
      .getOne();

    if (showtimesInRoom) {
      throw new HttpException(
        'Room is already occupied during this time slot',
        409,
      );
    }

    try {
      // add 15 minutes to the end date
      newShowtime.endDate = new Date(
        newShowtime.endDate.getTime() + 15 * 1000 * 60,
      );
      return await this.showtimeRepository.save({
        ...newShowtime,
        room: { id: room.id },
        movie: { id: movie.id },
      });
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  async getShowtime(showtimeId: string): Promise<Showtime> {
    try {
      return await this.showtimeRepository.findOne({
        where: { id: showtimeId },
        relations: ['movie', 'room'],
      });
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
  async getShowtimes(): Promise<Showtime[]> {
    try {
      return await this.showtimeRepository.find({
        where: {
          startDate: MoreThanOrEqual(new Date()),
        },
        relations: ['movie', 'room'],
      });
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
