import { config } from 'dotenv';
import { Genre } from '../../movie/entities/genre.entity';
import { Movie } from '../../movie/entities/movie.entity';
import { Role } from '../../user/entities/role.entity';
import { User } from '../../user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import userFactory from './factories/user.factory';
import RoleSeeder from './seeds/role.seeder';
import UserSeeder from './seeds/user.seeder';
import GenreSeeder from './seeds/genre.seeder';
import MovieSeeder from './seeds/movie.seeder';
import movieFactory from './factories/movie.factory';

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
  seeds: [RoleSeeder, UserSeeder, GenreSeeder, MovieSeeder],
  factories: [userFactory, movieFactory],
};

export const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  console.log('Database connected');
  await runSeeders(dataSource);
  console.log('Database seeded');
  process.exit();
});
