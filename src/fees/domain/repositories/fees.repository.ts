import { BaseRepository } from '@common/repositories/BaseRepository';
import { Fee } from '../fee';

export abstract class FeesRepository extends BaseRepository<Fee> {
  abstract update(repository: Fee): Promise<Fee>;
}
