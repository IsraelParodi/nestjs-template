import { Injectable, Logger } from '@nestjs/common';
import { ComplainsRepository } from '../ports/outbound/complains.repository';
import { DeleteComplainUseCase } from '../ports/inbound/delete-complain.use-case';

@Injectable()
export class DeleteComplainService implements DeleteComplainUseCase {
  private readonly logger: Logger = new Logger(DeleteComplainService.name);

  constructor(private readonly complainsRepository: ComplainsRepository) {}

  async execute(id: number) {
    return this.complainsRepository.delete(id);
  }
}
