import { ContactUs } from '../contact-us';
import { BaseRepository } from '@common/repositories/BaseRepository';

export abstract class ContactUsRepository extends BaseRepository<ContactUs> {
  abstract update(repository: ContactUs): Promise<ContactUs>;
}
