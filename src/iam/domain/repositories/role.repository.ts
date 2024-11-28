import { Role } from '@users/domain/role';
import { BaseRepository } from '@common/repositories/BaseRepository';

export abstract class RoleRepository extends BaseRepository<Role> {}
