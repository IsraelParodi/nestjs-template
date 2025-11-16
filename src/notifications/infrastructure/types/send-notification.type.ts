import { SendEmailType } from './send-email.type';
import { SendSmsType } from './send-sms.type';

export type SendNotificationType = SendEmailType | SendSmsType;
