import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShowtimeStatus } from '../enums/showtime-status.enum';
import { User } from 'src/user/entities/user.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Seat } from 'src/room/entities/seat.entity';

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
    enum: ShowtimeStatus,
    default: ShowtimeStatus.PENDING,
    nullable: false,
  })
  status: ShowtimeStatus;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 6,
    scale: 2,
  })
  totalPrice: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @OneToOne(() => Showtime)
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
