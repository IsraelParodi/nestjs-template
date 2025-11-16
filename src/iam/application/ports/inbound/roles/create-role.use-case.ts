import { Role } from '@users/domain/entities/role';
import { CreateRoleCommand } from '@iam/application/commands/roles/create-role.command';

export abstract class CreateRoleUseCase {
  abstract execute(dto: CreateRoleCommand): Promise<Role>;
}
