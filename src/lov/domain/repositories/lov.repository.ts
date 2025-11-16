import { BaseRepository } from '@common/repositories/BaseRepository';
import { ListOfValues } from '../lov';

export abstract class ListOfValuesRepository extends BaseRepository<ListOfValues> {
  abstract update(repository: ListOfValues): Promise<ListOfValues>;
}
