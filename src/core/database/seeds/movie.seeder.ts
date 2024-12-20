import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Movie } from '../../../movie/entities/movie.entity';
import { Genre } from '../../../movie/entities/genre.entity';
import { DataSource } from 'typeorm';
export default class MovieSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const genreRepository = datasource.getRepository(Genre);

    console.log('.\n.\n.\nobtaining seeded genres...');
    const genres = await genreRepository.find();
    const movieFactory = factoryManager.get(Movie);
    movieFactory.setMeta(genres);
    console.log('seeding movies...');
    await movieFactory.saveMany(20);
  }
}
