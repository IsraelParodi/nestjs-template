import { Injectable } from '@nestjs/common';
import { SendEmailType } from '@notifications/infrastructure/types/send-email.type';

@Injectable()
export abstract class EmailProvider {
  abstract send(params: SendEmailType): Promise<void>;
}
