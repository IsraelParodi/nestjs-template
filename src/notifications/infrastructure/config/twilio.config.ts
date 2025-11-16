import { registerAs } from '@nestjs/config';

export default registerAs('twilio', () => {
  return {
    apiAccountSid: process.env.TWILIO_API_ACCOUNT_SID,
    apiToken: process.env.TWILIO_API_TOKEN,
    apiSender: process.env.TWILIO_API_SENDER,
  };
});
