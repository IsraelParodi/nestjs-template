import { Injectable, Logger } from '@nestjs/common';
import { ComplainsRepository } from '../ports/outbound/complains.repository';
import { ListComplainsUseCase } from '../ports/inbound/list-complains.use-case';
import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';

@Injectable()
export class ListComplainService implements ListComplainsUseCase {
  private readonly logger: Logger = new Logger(ListComplainService.name);

  constructor(private readonly complainsRepository: ComplainsRepository) {}

  async execute(paginationQueryDto: PaginationQueryDto) {
    return this.complainsRepository.findAllPaginated(paginationQueryDto);
  }
}
