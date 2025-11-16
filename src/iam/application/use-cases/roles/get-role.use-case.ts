import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Role } from '@users/domain/entities/role';
import { structuredObject } from '@common/infrastructure/utils/common.utils';
import { GetRoleUseCase } from '@iam/application/ports/inbound/roles/get-role.use-case';
import { RoleRepository } from '@iam/application/ports/outbound/role.repository';

@Injectable()
export class GetRoleService implements GetRoleUseCase {
  private readonly logger: Logger = new Logger(GetRoleService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(id: number): Promise<Role> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundException(
        `Role with ${structuredObject({ id })} not found`,
      );
    }

    return role;
  }
}
