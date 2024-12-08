import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => {
  return {
    PORT: process.env.PORT || 3000,
  };
});
