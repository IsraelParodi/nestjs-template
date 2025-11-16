import { Injectable, Logger } from '@nestjs/common';
import { ContactUs } from '@contact-us/domain/contact-us';
import { ListContactUsUseCase } from '../ports/inbound/list-contact-us.use-case';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import {
  ContactUsRepository,
  PaginationOptions,
} from '../ports/outbound/contact-us.repository';

@Injectable()
export class ListContactUsService implements ListContactUsUseCase {
  private readonly logger: Logger = new Logger(ListContactUsService.name);

  constructor(private readonly contactUsRepository: ContactUsRepository) {}

  async execute(
    options: PaginationOptions,
  ): Promise<PaginatedResult<ContactUs>> {
    return this.contactUsRepository.findAllPaginated(options);
  }
}
