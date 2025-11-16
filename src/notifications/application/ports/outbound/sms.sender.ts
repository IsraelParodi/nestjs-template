import { Injectable } from '@nestjs/common';
import { SendSmsType } from '@notifications/infrastructure/types/send-sms.type';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export abstract class SmsSender {
  abstract send(params: SendSmsType): Promise<MessageInstance>;
}
