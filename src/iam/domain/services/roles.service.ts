import { Injectable } from '@nestjs/common';
import { Role } from '@users/domain/role';
import { RoleRepository } from '../repositories/role.repository';
import { CreateRoleDto } from '@iam/presenters/dto/roles/create-role.dto';
import { UpdateRoleDto } from '@iam/presenters/dto/roles/update-role.dto';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';

@Injectable()
export class RolesDomainService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = new Role();
    role.name = createRoleDto.name;

    return this.roleRepository.save(role);
  }

  findAll({ start, limit }: PaginationQueryDto) {
    return this.roleRepository.find({ start, limit });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } });
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
