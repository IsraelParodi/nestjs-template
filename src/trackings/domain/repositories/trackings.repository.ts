import { BaseRepository } from '@common/repositories/BaseRepository';
import { Tracking } from '../tracking';

export abstract class TrackingsRepository extends BaseRepository<Tracking> {
  abstract update(repository: Tracking): Promise<Tracking>;
}
