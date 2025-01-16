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

  @Column({
    name: 'block_until',
    nullable: true,
    type: 'timestamp',
  })
  blockUntil: Date;

  @OneToMany(() => Seat, (seat) => seat.room)
  seats: Seat[];
}
