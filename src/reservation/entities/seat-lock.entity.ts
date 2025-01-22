import { Seat } from 'src/room/entities/seat.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class SeatLock {
  // Composite PK columns
  @PrimaryColumn({ name: 'seat_id', type: 'int' })
  seatId?: number;

  @PrimaryColumn({ name: 'showtime_id', type: 'uuid' })
  showtimeId?: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  // Relations
  @ManyToOne(() => Seat)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @ManyToOne(() => Showtime)
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', name: 'lock_until' })
  lockUntil: Date;
}
