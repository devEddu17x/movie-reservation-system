import { hash } from 'bcrypt';
import { Role } from '../../../user/entities/role.entity';
import { User } from '../../../user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, async (faker, meta: Role) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = await hash('password', 5);
  user.name = faker.person.firstName();
  user.lastname = faker.person.lastName();
  user.role = meta;
  return user;
});
