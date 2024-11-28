import { DeleteResult } from 'typeorm';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '../interfaces/commons.interface';

export abstract class BaseRepository<T> {
  abstract create(user: T): Promise<T>;
  abstract save(user: T): Promise<T>;
  abstract findOne({ where, select, relations }: IFindOne<T>): Promise<T>;
  abstract find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<T>>;
  abstract delete(roleId: number): Promise<DeleteResult>;
}
