import { User } from '@users/domain/entities/user';
import { Email } from '@users/domain/value-objects/email.vo';
import { UserEntity } from '../entities/user.entity';
import { CountryMapper } from '@localities/infrastructure/adapters/typeorm/mappers/country.mapper';
import { RoleMapper } from '@iam/infrastructure/adapters/typeorm/mappers/role.mapper';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return User.restore({
      id: entity?.id,
      email: new Email(entity?.email),
      passwordHash: entity?.passwordHash,
      role: entity?.role ? RoleMapper.toDomain(entity.role) : undefined,
      name: entity?.name,
      lastname: entity?.lastname,
      businessTaxId: entity?.businessTaxId,
      legalName: entity?.legalName,
      country: entity?.country
        ? CountryMapper.toDomain(entity.country)
        : undefined,
      phone: entity?.phone ?? undefined,
      address: entity?.address ?? undefined,
      createdAt: entity?.createdAt,
      updatedAt: entity?.updatedAt,
    });
  }

  static toPersistence(user: User): Partial<UserEntity> {
    return {
      id: user?.id,
      email: user?.email.getValue(),
      passwordHash: user?.passwordHash,
      role: user?.role ? RoleMapper.toPersistence(user.role) : undefined,
      country: user?.country
        ? CountryMapper.toPersistence(user?.country)
        : undefined,
      name: user?.name,
      lastname: user?.lastname,
      businessTaxId: user?.businessTaxId,
      legalName: user?.legalName,
      phone: user?.phone ?? null,
      address: user?.address ?? null,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    };
  }
}
