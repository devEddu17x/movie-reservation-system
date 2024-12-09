import { registerAs } from '@nestjs/config';
import { Role } from 'src/user/entities/role.entity';
import { User } from 'src/user/entities/user.entity';

export default registerAs('database', () => {
  return {
    type: process.env.DB_TYPE as 'postgres', // type must be a literal otherwise it will be inferred as string and wont work
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Role, User],
    synchronize: true,
  };
});
