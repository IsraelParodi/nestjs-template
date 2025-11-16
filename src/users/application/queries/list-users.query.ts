export interface ListUsersQuery {
  page: number;
  limit: number;

  name?: string;
  lastname?: string;
  roleId?: number;
}
