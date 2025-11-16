import { registerAs } from '@nestjs/config';

export default registerAs('sengrid', () => {
  return {
    apiKey: process.env.SENDGRID_API_KEY,
    apiSender: process.env.SENDGRID_API_SENDER,
  };
});
