import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '@iam/presenters/dto/roles/create-role.dto';
import { UpdateRoleDto } from '@iam/presenters/dto/roles/update-role.dto';
import { RolesDomainService } from '@iam/domain/services/roles.service';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';
import { Role } from '@users/domain/role';

@Injectable()
export class RolesApplicationService {
  constructor(private readonly rolesDomainService: RolesDomainService) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.rolesDomainService.create(createRoleDto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.rolesDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<Role>) {
    return this.rolesDomainService.findOne({ where, relations, select });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.rolesDomainService.update(id, updateRoleDto);
  }

  remove(id: number) {
    return this.rolesDomainService.remove(id);
  }
}
