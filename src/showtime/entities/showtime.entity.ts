import { Movie } from '../../movie/entities/movie.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
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
  movie: Movie;
}
