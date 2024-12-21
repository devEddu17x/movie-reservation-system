import { Seat } from '../../../room/entities/seat.entity';
import { Room } from '../../../room/entities/room.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class SeatSeeder implements Seeder {
  public async run(database: DataSource): Promise<any> {
    const seatRepository = database.getRepository(Seat);
    const roomsRepository = database.getRepository(Room);

    const rooms = await roomsRepository.find();

    const columsLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    console.log('seeding seats...');
    for (const room of rooms) {
      // 10 rows and 10 columns for each room
      const seats: Seat[] = [];
      for (let i = 1; i <= 10; i++) {
        for (let j = 0; j < 10; j++) {
          seats.push({
            rowNumber: i,
            columnLetter: columsLetters[j],
            room: room,
          });
        }
      }
      await seatRepository.insert(seats);
    }
  }
}
