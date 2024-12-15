import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  return {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    rounds: parseInt(process.env.SALT_ROUNDS, 10),
  };
});
