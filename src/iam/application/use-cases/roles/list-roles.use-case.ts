import { Injectable, Logger } from '@nestjs/common';
import { RoleRepository } from '@iam/application/ports/outbound/role.repository';
import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { ListRolesUseCase } from '@iam/application/ports/inbound/roles/list-roles.use-case';

@Injectable()
export class ListRolesService implements ListRolesUseCase {
  private readonly logger: Logger = new Logger(ListRolesService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  async execute({ page, limit }: PaginationQueryDto) {
    return this.roleRepository.findAllPaginated({ page, limit });
  }
}
