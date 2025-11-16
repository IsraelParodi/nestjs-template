import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ListOfValues } from '@lov/domain/entities/lov';

export abstract class ListOfValuesRepository {
  abstract findById(id: number): Promise<ListOfValues | null>;
  abstract findByKey(key: string): Promise<ListOfValues | null>;
  abstract findChildByKey(key: string, valueId: number);
  abstract findChildByName(key: string, name: string);
  abstract findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<ListOfValues>>;
  abstract save(lov: ListOfValues): Promise<ListOfValues>;
  abstract delete(userId: number, deletedBy?: number): Promise<void>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortOrder?: 'ASC' | 'DESC';
}
