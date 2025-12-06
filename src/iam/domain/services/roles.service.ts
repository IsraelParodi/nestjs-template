import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@users/domain/role';
import { RoleRepository } from '../repositories/role.repository';
import { CreateRoleDto } from '@iam/presenters/dto/roles/create-role.dto';
import { UpdateRoleDto } from '@iam/presenters/dto/roles/update-role.dto';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { Permission } from '@users/domain/permission';
import { IFindOne } from '@common/interfaces/commons.interface';
import { structuredObject } from '@common/common.utils';

@Injectable()
export class RolesDomainService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto) {
    const roleFound = await this.findOne({
      where: { name: createRoleDto.name },
      validate: false,
    });

    if (roleFound) throw new BadRequestException('The Role already exists');

    const role = new Role();
    role.name = createRoleDto.name;
    role.description = createRoleDto.description;
    role.permissions = createRoleDto.permissions?.map(
      (permission) => new Permission(permission),
    );

    return this.roleRepository.save(role);
  }

  findAll({ start, limit }: PaginationQueryDto) {
    return this.roleRepository.find({ start, limit });
  }

  async findOne({ where, relations, select, validate = true }: IFindOne<Role>) {
    const role = await this.roleRepository.findOne({
      where,
      relations,
      select,
    });

    if (validate && !role) {
      throw new NotFoundException(
        `Role with ${structuredObject(where)} not found`,
      );
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
