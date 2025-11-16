import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ContactUs } from '@contact-us/domain/contact-us';
import { PaginationOptions } from '../outbound/contact-us.repository';

export abstract class ListContactUsUseCase {
  abstract execute(
    options: PaginationOptions,
  ): Promise<PaginatedResult<ContactUs>>;
}
