import { Complains } from '../complains';
import { BaseRepository } from '@common/repositories/BaseRepository';

export abstract class ComplainsRepository extends BaseRepository<Complains> {
  abstract update(repository: Complains): Promise<Complains>;
}
