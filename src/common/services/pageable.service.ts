import {
  PaginatedRequest,
  PaginatedResult,
} from '@common/infrastructure/interfaces/commons.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PageableService {
  getPages<T>(params: PaginatedRequest<T>): PaginatedResult<T> {
    const { data, total, page, limit } = params;

    return {
      data,
      total,
      empty: !data.length,
      firstElement: page == 0,
      pageNumber: Math.floor(page / limit) + 1,
      lastElement: total <= page + limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
