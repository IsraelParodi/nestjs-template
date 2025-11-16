import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Role } from '@users/domain/entities/role';
import { Permission } from '@users/domain/entities/permission';
import { RoleRepository } from '@iam/application/ports/outbound/role.repository';
import { CreateRoleCommand } from '@iam/application/commands/roles/create-role.command';
import { CreateRoleUseCase } from '@iam/application/ports/inbound/roles/create-role.use-case';

@Injectable()
export class CreateRoleService implements CreateRoleUseCase {
  private readonly logger: Logger = new Logger(CreateRoleService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(dto: CreateRoleCommand): Promise<Role> {
    const roleFound = await this.roleRepository.existsByName(dto.name);

    if (roleFound) throw new BadRequestException('The Role already exists');

    const role = new Role();
    role.name = dto.name;
    role.description = dto.description;
    role.permissions = dto.permissions?.map(
      (permission) => new Permission(permission),
    );

    return this.roleRepository.save(role);
  }
}
