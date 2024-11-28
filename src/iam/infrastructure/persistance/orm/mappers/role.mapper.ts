import { Role } from '@users/domain/role';
import { RoleEntity } from '../entities/role.entity';

export class RoleMapper {
  static toDomain(roleEntity: RoleEntity): Role {
    const role = new Role(roleEntity.id);

    role.name = roleEntity.name;
    role.permissions = roleEntity.permissions;

    return role;
  }

  static toPersistence(role: Role): RoleEntity {
    const entity = new RoleEntity();

    entity.id = role.id;
    entity.name = role.name;
    // entity.permissions = role.permissions;

    return entity;
  }
}
