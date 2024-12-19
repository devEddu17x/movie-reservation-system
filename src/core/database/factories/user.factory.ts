import { hash } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, async (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = await hash('password', 10);
  user.name = faker.person.firstName();
  user.lastname = faker.person.lastName();
  return user;
});
