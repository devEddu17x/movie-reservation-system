import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Room } from 'src/room/entities/room.entity';
import { Seat } from 'src/room/entities/seat.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    // entities to be included: Reservation, Movie, User, Showtime, Room, Seat
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}
  async reservationForEachMovie(daysCriteria: number) {
    const data = await this.movieRepository
      .createQueryBuilder('m')
      .innerJoin('m.showtimes', 's')
      .innerJoin('reservation', 'r', 'r.showtime_id = s.id')
      .innerJoin('r.user', 'u')
      .innerJoin('s.room', 'rm')
      .leftJoin('reservation_seat', 'rs', 'rs.reservation_id = r.id')
      .select('m.id', 'id')
      .addSelect('m.title', 'title')
      .addSelect('COUNT(DISTINCT r.id)', 'total_reservations_made')
      .addSelect('COUNT(rs.reservation_id)', 'total_seats_reserved')
      .addSelect(
        ` (SELECT SUM(r2.total_price)
          FROM reservation r2
          INNER JOIN showtime s2 ON r2.showtime_id = s2.id
          WHERE s2.movie_id = m.id AND r2.created_date >= NOW() - (:days || ' days')::interval
          )`,
        'total_revenue',
      )
      .addSelect('COUNT(DISTINCT u.id)', 'total_users')
      .addSelect(
        `     json_agg(
                json_build_object(
                  'reservation',     json_build_object(
                                    'id', r.id,
                                    'created_date', r.created_date,
                                    'total_price', r.total_price,
                                    'status', r.status
                              ),
                  'showtime', json_build_object(
                                    'id', s.id,
                                    'start_date', s.start_date,
                                    'end_date', s.end_date
                              ),
                  'room',     json_build_object(
                                    'id', rm.id,
                                    'type', rm.type
                              ),
                  'user',     json_build_object(
                                    'id', u.id,
                                    'email', u.email
                              )
                )
              )
            `,
        'reservations',
      )
      .where("r.created_date >= NOW() - (:days || ' days')::interval", {
        days: daysCriteria,
      })
      .groupBy('m.id, m.title')
      .getRawMany();

    return data;
  }
}
