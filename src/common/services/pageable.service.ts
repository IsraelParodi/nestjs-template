import {
  PaginatedRequest,
  PaginatedResult,
} from '@common/interfaces/commons.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PageableService {
  getPages<T>(params: PaginatedRequest<T>): PaginatedResult<T> {
    const { data, total, start, limit } = params;

    return {
      data,
      total,
      empty: !data.length,
      firstElement: start == 0,
      pageNumber: Math.floor(start / limit) + 1,
      lastElement: total <= start + limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
