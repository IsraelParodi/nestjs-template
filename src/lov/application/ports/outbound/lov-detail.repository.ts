import { ListOfValuesDetail } from '@lov/domain/entities/lov-detail';

export abstract class ListOfValuesDetailRepository {
  abstract findById(id: number): Promise<ListOfValuesDetail | null>;
  abstract save(lov: ListOfValuesDetail): Promise<ListOfValuesDetail>;
  abstract delete(userId: number, deletedBy?: number): Promise<void>;
}
