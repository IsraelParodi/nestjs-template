import { Injectable } from '@nestjs/common';
import { SendEmailType } from '@notifications/infrastructure/types/send-email.type';

@Injectable()
export abstract class EmailSender {
  abstract send(params: SendEmailType): Promise<void>;
}
