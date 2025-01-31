import { registerAs } from '@nestjs/config';

export default registerAs('paypal', () => {
  return {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    enviroment: process.env.PAYPAL_ENVIRONMENT as 'Sandbox' | 'Production',
  };
});
