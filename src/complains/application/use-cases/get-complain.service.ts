import { Injectable, Logger } from '@nestjs/common';
import { ComplainsRepository } from '../ports/outbound/complains.repository';
import { GetComplainUseCase } from '../ports/inbound/get-complain.use-case';

@Injectable()
export class GetComplainService implements GetComplainUseCase {
  private readonly logger: Logger = new Logger(GetComplainService.name);

  constructor(private readonly complainsRepository: ComplainsRepository) {}

  async execute(id: number) {
    return this.complainsRepository.findById(id);
  }
}
