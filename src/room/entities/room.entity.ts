import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomType } from '../enums/room-type.enum';
import { Seat } from './seat.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    length: 10,
    unique: true,
    nullable: false,
    default: RoomType.REGULAR,
  })
  type: RoomType;

  @OneToMany(() => Seat, (seat) => seat.room)
  seats: Seat[];
}
