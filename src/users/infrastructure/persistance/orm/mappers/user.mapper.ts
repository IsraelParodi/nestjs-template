import { RoleEntity } from 'src/iam/infrastructure/persistance/orm/entities/role.entity';
import { Role } from 'src/users/domain/role';
import { User } from 'src/users/domain/user';
import { UserEntity } from 'src/users/infrastructure/persistance/orm/entities/user.entity';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    const user = new User(userEntity.id);
    const role = new Role();
    role.id = userEntity.role.id;
    role.name = userEntity.role.name;

    user.email = userEntity.email;
    user.password = userEntity.password;
    user.role = role;

    return user;
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    const role = new RoleEntity();
    role.id = user.role.id;

    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.role = role;

    return entity;
  }
}
