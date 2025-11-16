import { Injectable, Logger } from '@nestjs/common';
import { Role } from '@users/domain/entities/role';
import { RoleRepository } from '@iam/application/ports/outbound/role.repository';
import { UpdateRoleCommand } from '@iam/application/commands/roles/update-role.command';
import { UpdateRoleUseCase } from '@iam/application/ports/inbound/roles/update-role.use-case';

@Injectable()
export class UpdateRoleService implements UpdateRoleUseCase {
  private readonly logger: Logger = new Logger(UpdateRoleService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(id: number, command: UpdateRoleCommand): Promise<Role> {
    const role = await this.roleRepository.findById(id);

    Object.assign(role, command);
    return this.roleRepository.save(role);
  }
}
