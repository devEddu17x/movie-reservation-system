import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Seat {
  @PrimaryColumn({
    name: 'column_letter',
    type: 'char',
  })
  columnLetter: string;

  @PrimaryColumn({
    name: 'row_number',
  })
  rowNumber: number;

  @ManyToOne(() => Room, (room) => room.seats)
  room: Room;
}
