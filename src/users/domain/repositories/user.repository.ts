import {
  IFind,
  PaginatedResult,
} from 'src/common/interfaces/commons.interface';
import { User } from '../user';
import { DeleteResult } from 'typeorm';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract save(user: User): Promise<User>;
  abstract findOne({
    where,
    relations,
  }: {
    where: object;
    relations?: string[];
  }): Promise<User>;
  abstract find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<User>>;
  abstract delete(roleId: number): Promise<DeleteResult>;
}
