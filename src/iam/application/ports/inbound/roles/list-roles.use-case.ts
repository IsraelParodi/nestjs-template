import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';

export abstract class ListRolesUseCase {
  abstract execute({ page, limit }: PaginationQueryDto);
}
