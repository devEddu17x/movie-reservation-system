import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationStatus } from '../enums/showtime-status.enum';
import { User } from '../../user/entities/user.entity';
import { Showtime } from '../../showtime/entities/showtime.entity';
import { Seat } from '../../room/entities/seat.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn({
    name: 'created_date',
  })
  date: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
    nullable: false,
  })
  status: ReservationStatus;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 6,
    scale: 2,
  })
  totalPrice: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Showtime)
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;
  @ManyToMany(() => Seat)
  @JoinTable({
    name: 'reservation_seat',
    joinColumn: {
      name: 'reservation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'seat_id',
      referencedColumnName: 'id',
    },
  })
  seats: Seat[];
}
