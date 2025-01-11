import { config } from 'dotenv';
import { Genre } from '../../movie/entities/genre.entity';
import { Movie } from '../../movie/entities/movie.entity';
import { Role } from '../../user/entities/role.entity';
import { User } from '../../user/entities/user.entity';
import { Room } from '../../room/entities/room.entity';
import { Seat } from '../../room/entities/seat.entity';
import { BlackListRefreshToken } from '../../auth/entities/refresh-token.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import RoleSeeder from './seeds/role.seeder';
import UserSeeder from './seeds/user.seeder';
import GenreSeeder from './seeds/genre.seeder';
import MovieSeeder from './seeds/movie.seeder';
import RoomSeeder from './seeds/room.seeder';
import SeatSeeder from './seeds/seat.seeder';
import userFactory from './factories/user.factory';
import movieFactory from './factories/movie.factory';

config({ path: '.env.development.local' });
const options: DataSourceOptions & SeederOptions = {
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Role, User, Movie, Genre, Room, Seat, BlackListRefreshToken],
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../../core/database/migrations/**/*.ts'],
  seeds: [
    RoleSeeder,
    UserSeeder,
    GenreSeeder,
    MovieSeeder,
    RoomSeeder,
    SeatSeeder,
  ],
  factories: [userFactory, movieFactory],
};

export const dataSource = new DataSource(options);
