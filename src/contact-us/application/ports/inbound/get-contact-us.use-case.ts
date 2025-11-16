import { ContactUs } from '@contact-us/domain/contact-us';

export abstract class GetContactUsUseCase {
  abstract execute(id: number): Promise<ContactUs>;
}
