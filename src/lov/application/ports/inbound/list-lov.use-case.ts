import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';

export abstract class ListLovUseCase {
  abstract execute(paginationQueryDto: PaginationQueryDto);
}
