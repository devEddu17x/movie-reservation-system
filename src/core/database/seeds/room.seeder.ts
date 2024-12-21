import { RoomType } from '../../../room/enums/room-type.enum';
import { Room } from '../../../room/entities/room.entity';
import { DataSource } from 'typeorm';

export default class RoomSeeder {
  public async run(datasource: DataSource): Promise<any> {
    const repository = datasource.getRepository(Room);
    const rooms = [
      {
        name: 1,
        type: RoomType.REGULAR,
      },
      {
        name: 2,
        type: RoomType.REGULAR,
      },
      {
        name: 3,
        type: RoomType.REGULAR,
      },
      {
        name: 4,
        type: RoomType.REGULAR,
      },
      {
        name: 5,
        type: RoomType.REGULAR,
      },
      {
        name: 6,
        type: RoomType.PRIME,
      },
      {
        name: 7,
        type: RoomType.PRIME,
      },
      {
        name: 8,
        type: RoomType.PRIME,
      },
      {
        name: 9,
        type: RoomType.PRIME,
      },
      {
        name: 10,
        type: RoomType.PRIME,
      },
    ];
    console.log('seeding rooms...');
    await repository.insert(rooms);
  }
}
