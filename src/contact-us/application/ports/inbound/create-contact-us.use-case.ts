import { ContactUs } from '@contact-us/domain/contact-us';

export abstract class CreateContactUsUseCase {
  abstract execute(contactUs: ContactUs): Promise<ContactUs>;
}
