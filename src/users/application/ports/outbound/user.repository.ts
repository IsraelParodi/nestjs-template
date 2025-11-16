import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { Role } from '@users/domain/entities/role';
import { User } from '@users/domain/entities/user';

export abstract class UserRepository {
  abstract findById(id: number): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract getById(id: number): Promise<User>;
  abstract getByEmail(email: string): Promise<User>;
  abstract findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<User>>;
  abstract save(user: User): Promise<User>;
  abstract delete(userId: number, deletedBy?: number): Promise<void>;
  abstract deleteMany(userIds: number[], deletedBy?: number): Promise<void>;
}

export interface FindUsersOptions {
  name?: string;
  lastname?: string;
  roleId?: number | string | Role;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt' | 'name' | 'email' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
  filters?: FindUsersOptions;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
