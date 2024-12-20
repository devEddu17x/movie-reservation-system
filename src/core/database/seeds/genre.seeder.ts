import { Genre } from '../../../movie/entities/genre.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class GenreSeeder implements Seeder {
  public async run(datasource: DataSource): Promise<any> {
    console.log('seeding genres...');
    const genres = [
      { name: 'Action' },
      { name: 'Adventure' },
      { name: 'Comedy' },
      { name: 'Crime' },
      { name: 'Drama' },
      { name: 'Fantasy' },
      { name: 'Historical' },
      { name: 'Horror' },
      { name: 'Mystery' },
      { name: 'Political' },
      { name: 'Romance' },
      { name: 'Science Fiction' },
      { name: 'Thriller' },
      { name: 'Western' },
    ];
    const genreRepository = datasource.getRepository(Genre);
    await genreRepository.insert(genres);
  }
}
