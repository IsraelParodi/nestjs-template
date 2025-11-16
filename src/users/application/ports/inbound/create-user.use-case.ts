import { CreateUserCommand } from '@users/application/commands/create-user.command';
import { User } from '@users/domain/entities/user';

export abstract class CreateUserUseCase {
  abstract execute(command: CreateUserCommand): Promise<User>;
}
