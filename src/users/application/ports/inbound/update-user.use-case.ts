import { UpdateUserCommand } from '@users/application/commands/update-user.command';
import { User } from '@users/domain/entities/user';

export abstract class UpdateUserUseCase {
  abstract execute(id: number, command: UpdateUserCommand): Promise<User>;
}
