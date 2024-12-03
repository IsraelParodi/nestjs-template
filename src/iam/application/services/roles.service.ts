import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from 'src/iam/presenters/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/iam/presenters/dto/roles/update-role.dto';
import { RolesDomainService } from 'src/iam/domain/services/roles.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto.ts';

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
