import { User } from '@users/domain/entities/user';

export abstract class GetUserUseCase {
  abstract execute(id: number): Promise<User>;
}
