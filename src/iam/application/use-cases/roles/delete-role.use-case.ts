import { DeleteRoleUseCase } from '@iam/application/ports/inbound/roles/delete-role.use-case';
import { RoleRepository } from '@iam/application/ports/outbound/role.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DeleteRoleService implements DeleteRoleUseCase {
  private readonly logger: Logger = new Logger(DeleteRoleService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(id: number) {
    return this.roleRepository.delete(id);
  }
}
