import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.entity';

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

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];
}
