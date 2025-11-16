import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';

export abstract class ListComplainsUseCase {
  abstract execute(paginationQueryDto: PaginationQueryDto);
}
