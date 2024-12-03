import { User } from '../user';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findOne({
    where,
    relations,
  }: {
    where: object;
    relations?: string[];
  }): Promise<User>;
}
