import { Role } from '@users/domain/entities/role';
import { UpdateRoleCommand } from '@iam/application/commands/roles/update-role.command';

export abstract class UpdateRoleUseCase {
  abstract execute(id: number, command: UpdateRoleCommand): Promise<Role>;
}
