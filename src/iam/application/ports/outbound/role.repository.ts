import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { Role } from '@users/domain/entities/role';

export abstract class RoleRepository {
  abstract findById(id: number): Promise<Role | null>;
  abstract findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Role>>;
  abstract save(role: Role): Promise<Role>;
  abstract delete(roleId: number): Promise<void>;
  abstract existsByName(name: string): Promise<boolean>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt' | 'name' | 'email' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
  filters?: FindRolesOptions;
}

export interface FindRolesOptions {
  isActive?: boolean;
  searchTerm?: string;
}
