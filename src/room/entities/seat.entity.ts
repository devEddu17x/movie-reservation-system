import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    name: 'column_letter',
    type: 'char',
  })
  columnLetter: string;

  @Column({
    name: 'row_number',
  })
  rowNumber: number;

  @ManyToOne(() => Room, (room) => room.seats)
  room: Room;
}
