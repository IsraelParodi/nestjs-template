import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { Injectable, Logger } from '@nestjs/common';
import { ListOfValuesRepository } from '@lov/application/ports/outbound/lov.repository';
import { ListLovUseCase } from '../ports/inbound/list-lov.use-case';

@Injectable()
export class ListLovService implements ListLovUseCase {
  private readonly logger: Logger = new Logger(ListLovService.name);

  constructor(
    private readonly listOfValuesRepositoryPort: ListOfValuesRepository,
  ) {}

  async execute(paginationQueryDto: PaginationQueryDto) {
    return this.listOfValuesRepositoryPort.findAllPaginated(paginationQueryDto);
  }
}
