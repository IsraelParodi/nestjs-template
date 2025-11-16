import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { Role } from '@users/domain/entities/role';
import { RoleMapper } from '../mappers/role.mapper';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { PageableService } from '@common/services/pageable.service';
import {
  PaginationOptions,
  RoleRepository,
} from '@iam/application/ports/outbound/role.repository';

@Injectable()
export class TypeOrmRoleRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async findById(id: number): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({
      where: { id },
    });

    return entity ? RoleMapper.toDomain(entity) : null;
  }

  async findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Role>> {
    const { page, limit } = options;

    const skip = (page - 1) * limit;

    const qb = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission');

    qb.skip(skip).take(limit);

    const [entities, total] = await qb.getManyAndCount();
    const data = entities.map((entity) => RoleMapper.toDomain(entity));

    return this.pageableService.getPages<Role>({
      data,
      total,
      page,
      limit,
    });
  }

  async save(role: Role): Promise<Role> {
    const persistenceModel = RoleMapper.toPersistence(role);
    const newEntity = await this.roleRepository.save(persistenceModel);
    return RoleMapper.toDomain(newEntity);
  }

  async delete(roleId: number): Promise<void> {
    await this.roleRepository.softDelete({ id: roleId });
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.roleRepository.count({
      where: {
        name,
        deletedAt: IsNull(),
      },
    });

    return count > 0;
  }
}
