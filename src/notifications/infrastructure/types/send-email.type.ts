import { NotificationChannelEnum } from '../enums/notification-channel.enum';

export type SendEmailType = {
  channel: NotificationChannelEnum.EMAIL;
  recipient: string;
  templateId: string;
  subject: string;
  message: {
    body: Record<string, string | number>;
  };
};
