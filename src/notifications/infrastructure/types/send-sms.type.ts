import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';

export type SendSmsType = {
  channel: NotificationChannel.SMS;
  recipient: string;
  message: string;
};
