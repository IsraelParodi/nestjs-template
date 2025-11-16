export interface PaginatedRequest<T> {
  data: T[];
  total: number;
  page: number;
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
