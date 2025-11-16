import { Injectable, Logger } from '@nestjs/common';
import { DeleteManyContactUsUseCase } from '../ports/inbound/delete-many-contact-us.use-case';
import { ContactUsRepository } from '../ports/outbound/contact-us.repository';

@Injectable()
export class DeleteManyContactUsService implements DeleteManyContactUsUseCase {
  private readonly logger: Logger = new Logger(DeleteManyContactUsService.name);

  constructor(private readonly contactUsRepository: ContactUsRepository) {}

  async execute(ids: number[], deletedBy: number): Promise<void> {
    await this.contactUsRepository.deleteMany(ids, deletedBy);
  }
}
