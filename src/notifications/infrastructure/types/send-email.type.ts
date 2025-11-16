import { NotificationChannel } from '@notifications/domain/value-objects/notification-channel.vo';

export type SendEmailType = {
  channel: NotificationChannel.EMAIL;
  recipient: string;
  templateId: string;
  subject: string;
  message: {
    body: Record<string, string | number>;
  };
};
