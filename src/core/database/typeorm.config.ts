import { config } from 'dotenv';
import { Genre } from 'src/movie/entities/genre.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { Role } from 'src/user/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import InitSeeder from './seeds/init.seeder';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

config({ path: '.env.development.local' });
const options: DataSourceOptions & SeederOptions = {
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Role, User, Movie, Genre],
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../../core/database/migrations/**/*.ts'],
  seeds: [InitSeeder],
};

export const source = new DataSource(options);
