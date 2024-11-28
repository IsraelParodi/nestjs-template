import { FindOptionsSelect } from 'typeorm';

export interface IFindOne<T> {
  where?: Partial<T>;
  select?: FindOptionsSelect<T>;
  relations?: string[];
}

export interface IFind {
  where?: object;
  relations?: string[];
  start?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  totalPages: number;
}
