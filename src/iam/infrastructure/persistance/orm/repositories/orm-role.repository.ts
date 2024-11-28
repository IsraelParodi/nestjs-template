import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { RoleRepository } from '@iam/domain/repositories/role.repository';
import { RoleEntity } from '../entities/role.entity';
import { Role } from '@users/domain/role';
import { RoleMapper } from '../mappers/role.mapper';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '@common/interfaces/commons.interface';

@Injectable()
export class OrmRoleRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async save(role: Role): Promise<Role> {
    const persistenceModel = RoleMapper.toPersistence(role);
    const newEntity = await this.roleRepository.save(persistenceModel);

    return RoleMapper.toDomain(newEntity);
  }

  async create(role: Role): Promise<Role> {
    return this.roleRepository.create(role);
  }

  async findOne({ where, relations }: IFindOne<Role>): Promise<Role> {
    const entity = await this.roleRepository.findOne({ where, relations });

    if (!entity) {
      throw new NotFoundException(`${Role.name} with ID ${where.id} not found`);
    }

    return RoleMapper.toDomain(entity);
  }

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<Role>> {
    const [roles, total] = await this.roleRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
    });
    return {
      data: roles.map((role) => RoleMapper.toDomain(role)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.roleRepository.delete({ id });
  }
}
