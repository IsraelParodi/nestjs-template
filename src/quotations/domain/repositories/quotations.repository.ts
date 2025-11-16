import { Quotations } from '../quotations';
import { BaseRepository } from '@common/repositories/BaseRepository';

export abstract class QuotationsRepository extends BaseRepository<Quotations> {
  abstract update(repository: Quotations): Promise<Quotations>;
}
