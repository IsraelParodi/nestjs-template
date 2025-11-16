import { FindOptionsSelect } from 'typeorm';

export interface IFindOne<T> {
  where?: Partial<T>;
  select?: FindOptionsSelect<T>;
  relations?: string[];
}

export interface IFind {
  where?: any;
  order?: any;
  select?: FindOptionsSelect<object>;
  relations?: string[];
  start?: number;
  limit?: number;
}

export interface PaginatedRequest<T> {
  data: T[];
  total: number;
  start: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  empty: boolean;
  firstElement: boolean;
  lastElement: boolean;
  pageNumber: number;
  total: number;
  totalPages: number;
}
