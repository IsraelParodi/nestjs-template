import {
  IFind,
  IFindOne,
  PaginatedResult,
} from 'src/common/interfaces/commons.interface';
import { DeleteResult } from 'typeorm';
import { Role } from 'src/users/domain/role';

export abstract class RoleRepository {
  abstract create(role: Role): Promise<Role>;
  abstract save(role: Role): Promise<Role>;
  abstract findOne({ where, relations }: IFindOne<Role>): Promise<Role>;
  abstract find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<Role>>;
  abstract delete(roleId: number): Promise<DeleteResult>;
}
