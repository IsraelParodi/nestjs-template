import { BaseRepository } from '@common/repositories/BaseRepository';
import { ListOfValuesDetail } from '../lov-detail';

export abstract class ListOfValuesDetailRepository extends BaseRepository<ListOfValuesDetail> {
  abstract update(repository: ListOfValuesDetail): Promise<ListOfValuesDetail>;
}
