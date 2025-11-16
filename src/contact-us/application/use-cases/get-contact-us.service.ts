import { Injectable, Logger } from '@nestjs/common';
import { ContactUs } from '@contact-us/domain/contact-us';
import { GetContactUsUseCase } from '../ports/inbound/get-contact-us.use-case';
import { ContactUsRepository } from '../ports/outbound/contact-us.repository';

@Injectable()
export class GetContactUsService implements GetContactUsUseCase {
  private readonly logger: Logger = new Logger(GetContactUsService.name);

  constructor(private readonly contactUsRepository: ContactUsRepository) {}

  async execute(id: number): Promise<ContactUs> {
    return this.contactUsRepository.findById(id);
  }
}
