import { registerAs } from '@nestjs/config';
import { BlackListRefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Genre } from 'src/movie/entities/genre.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { SeatLock } from 'src/reservation/entities/seat-locks.entity';
import { Room } from 'src/room/entities/room.entity';
import { Seat } from 'src/room/entities/seat.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Role } from 'src/user/entities/role.entity';
import { User } from 'src/user/entities/user.entity';

export default registerAs('database', () => {
  return {
    type: process.env.DB_TYPE as 'postgres', // type must be a literal otherwise it will be inferred as string and wont work
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      Role,
      User,
      Movie,
      Genre,
      Room,
      Seat,
      BlackListRefreshToken,
      Showtime,
      Reservation,
      SeatLock,
    ],
    synchronize: true,
  };
});
