import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShowtimeStatus } from '../enums/showtime-status.enum';
import { User } from 'src/user/entities/user.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';

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
}
