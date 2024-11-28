import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '@iam/presenters/dto/roles/create-role.dto';
import { UpdateRoleDto } from '@iam/presenters/dto/roles/update-role.dto';
import { RolesDomainService } from '@iam/domain/services/roles.service';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';

@Injectable()
export class RolesApplicationService {
  constructor(private readonly rolesDomainService: RolesDomainService) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.rolesDomainService.create(createRoleDto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.rolesDomainService.findAll(paginationQueryDto);
  }

  findOne(id: number) {
    return this.rolesDomainService.findOne(id);
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.rolesDomainService.update(id, updateRoleDto);
  }

  remove(id: number) {
    return this.rolesDomainService.remove(id);
  }
}
