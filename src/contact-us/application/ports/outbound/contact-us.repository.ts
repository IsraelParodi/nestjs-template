import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ContactUs } from '@contact-us/domain/contact-us';

export abstract class ContactUsRepository {
  abstract findById(id: number): Promise<ContactUs | null>;
  abstract findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<ContactUs>>;
  abstract save(user: ContactUs): Promise<ContactUs>;
  abstract delete(contactUsId: number, deletedBy?: number): Promise<void>;
  abstract deleteMany(
    contactUsIds: number[],
    deletedBy?: number,
  ): Promise<void>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortOrder?: 'ASC' | 'DESC';
}
