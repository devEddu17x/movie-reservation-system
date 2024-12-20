import { setSeederFactory } from 'typeorm-extension';
import { Movie } from '../../../movie/entities/movie.entity';
import { Genre } from '../../../movie/entities/genre.entity';

export default setSeederFactory(Movie, (faker, meta: Genre[]) => {
  const movie = new Movie();
  movie.title = faker.lorem.sentence();
  movie.description = faker.lorem.paragraph();
  movie.posterUrl = faker.image.url();
  movie.duration = `${faker.number.int({ min: 60, max: 180 })} min`;
  movie.year = faker.number.int({ min: 1950, max: 2023 });

  const genres = faker.helpers.arrayElements(
    meta,
    faker.number.int({ min: 1, max: 3 }),
  );
  movie.genres = genres;
  return movie;
});
