import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.entity';
import { MovieStatus } from '../enums/movie-status.enum';
import { Showtime } from '../../showtime/entities/showtime.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 255,
  })
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    name: 'poster_url',
    nullable: false,
  })
  posterUrl: string;

  @Column({
    nullable: false,
  })
  duration: string;

  @Column({
    nullable: false,
    type: 'int',
  })
  year: number;

  @Column({
    type: 'enum',
    enum: MovieStatus,
    default: MovieStatus.AVAILABLE,
    nullable: false,
  })
  status: MovieStatus;

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes?: Showtime[];
}
