import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomType } from '../enums/room-type.enum';
import { Seat } from './seat.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoomType,
    nullable: false,
    default: RoomType.REGULAR,
  })
  type: RoomType;

  @OneToMany(() => Seat, (seat) => seat.room)
  seats: Seat[];
}
