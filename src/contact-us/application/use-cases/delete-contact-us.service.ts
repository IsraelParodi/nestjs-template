import { Injectable, Logger } from '@nestjs/common';
import { DeleteContactUsUseCase } from '../ports/inbound/delete-contact-us.use-case';
import { ContactUsRepository } from '../ports/outbound/contact-us.repository';

@Injectable()
export class DeleteContactUsService implements DeleteContactUsUseCase {
  private readonly logger: Logger = new Logger(DeleteContactUsService.name);

  constructor(private readonly contactUsRepository: ContactUsRepository) {}

  async execute(id: number, deletedBy: number): Promise<void> {
    await this.contactUsRepository.delete(id, deletedBy);
  }
}
