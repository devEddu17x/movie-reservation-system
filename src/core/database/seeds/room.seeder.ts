import { RoomType } from '../../../room/enums/room-type.enum';
import { Room } from '../../../room/entities/room.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class RoomSeeder implements Seeder {
  public async run(datasource: DataSource): Promise<any> {
    const repository = datasource.getRepository(Room);
    const rooms = [
      {
        type: RoomType.REGULAR,
      },
      {
        type: RoomType.REGULAR,
      },
      {
        type: RoomType.REGULAR,
      },
      {
        type: RoomType.REGULAR,
      },
      {
        type: RoomType.REGULAR,
      },
      {
        type: RoomType.PRIME,
      },
      {
        type: RoomType.PRIME,
      },
      {
        type: RoomType.PRIME,
      },
      {
        type: RoomType.PRIME,
      },
      {
        type: RoomType.PRIME,
      },
    ];
    console.log('seeding rooms...');
    await repository.insert(rooms);
  }
}
