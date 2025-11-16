import { NotificationChannelEnum } from '../enums/notification-channel.enum';

export type SendSmsType = {
  channel: NotificationChannelEnum.SMS;
  recipient: string;
  message: string;
};
