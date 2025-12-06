import { User } from '../user';
import { BaseRepository } from '@common/repositories/BaseRepository';

export abstract class UserRepository extends BaseRepository<User> {
  abstract update(repository: User): Promise<User>;
}
