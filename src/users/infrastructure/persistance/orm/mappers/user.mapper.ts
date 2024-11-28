import { RoleEntity } from '@iam/infrastructure/persistance/orm/entities/role.entity';
import { Role } from '@users/domain/role';
import { User } from '@users/domain/user';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    const user = new User(userEntity.id);

    user.email = userEntity.email;
    user.password = userEntity.password;
    user.role = this.mapRoleToDomain(userEntity.role);
    user.createdBy = this.mapUserReferenceToDomain(userEntity.createdBy);
    user.updatedBy = this.mapUserReferenceToDomain(userEntity.updatedBy);
    user.deletedBy = this.mapUserReferenceToDomain(userEntity.deletedBy);
    user.createdAt = userEntity.createdAt;
    user.updatedAt = userEntity.updatedAt;
    user.deletedAt = userEntity.deletedAt;

    return user;
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();

    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.role = this.mapRoleToPersistence(user.role);
    entity.createdBy = this.mapUserReferenceToPersistence(user.createdBy);
    entity.updatedBy = this.mapUserReferenceToPersistence(user.updatedBy);
    entity.deletedBy = this.mapUserReferenceToPersistence(user.deletedBy);
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.deletedAt = user.deletedAt;

    return entity;
  }

  private static mapRoleToDomain(roleEntity: RoleEntity): Role {
    if (!roleEntity) return null;
    const role = new Role(roleEntity.id);
    role.name = roleEntity.name;
    return role;
  }

  private static mapRoleToPersistence(role: Role): RoleEntity {
    if (!role) return null;
    const roleEntity = new RoleEntity();
    roleEntity.id = role.id;
    roleEntity.name = role.name;
    return roleEntity;
  }

  private static mapUserReferenceToDomain(userEntity?: UserEntity): User {
    if (!userEntity) return null;
    const user = new User(userEntity.id);
    user.email = userEntity.email;
    return user;
  }

  private static mapUserReferenceToPersistence(user?: User): UserEntity {
    if (!user) return null;
    const userEntity = new UserEntity();
    userEntity.id = user.id;
    userEntity.email = user.email;
    return userEntity;
  }
}
