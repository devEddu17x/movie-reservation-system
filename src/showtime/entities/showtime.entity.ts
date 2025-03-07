import { Room } from '../../room/entities/room.entity';
import { Movie } from '../../movie/entities/movie.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
  JoinColumn,
} from 'typeorm';

@Entity()
@Check(`"end_date" > "start_date"`)
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'start_date',
    type: 'timestamp',
    nullable: false,
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp',
    nullable: false,
  })
  endDate: Date;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    name: 'seat_price',
  })
  seatPrice: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
