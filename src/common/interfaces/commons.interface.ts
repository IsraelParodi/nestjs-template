export interface IFindOne<T> {
  where?: Partial<T>;
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
