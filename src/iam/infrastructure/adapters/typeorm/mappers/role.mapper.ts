import { Role } from '@users/domain/entities/role';
import { RoleEntity } from '../entities/role.entity';
import { Permission } from '@users/domain/entities/permission';
import { PermissionEntity } from '../entities/permission.entity';

export class RoleMapper {
  static toDomain(roleEntity: RoleEntity): Role {
    const role = new Role(roleEntity.id);

    role.name = roleEntity.name;
    role.description = roleEntity.description;
    role.permissions = roleEntity.permissions;

    return role;
  }

  static toPersistence(role: Role): RoleEntity {
    const entity = new RoleEntity();

    entity.id = role.id;
    entity.name = role.name;
    entity.description = role.description;
    entity.permissions = this.mapPermissionsReferenceToPersistence(
      role.permissions,
    );

    return entity;
  }

  static mapPermissionsReferenceToPersistence(
    permissions?: Permission[],
  ): PermissionEntity[] {
    const permissionsList: PermissionEntity[] = [];

    if (permissions?.length > 0) {
      permissions?.forEach((permission) => {
        const permissionEntity = new PermissionEntity();
        permissionEntity.id = permission.id;
        permissionEntity.name = permission.name;
        permissionsList.push(permissionEntity);
      });
    }

    return permissionsList;
  }
}
