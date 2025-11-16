import { DeleteResult } from 'typeorm';
import { IFind, IFindOne, PaginatedResult } from '../interfaces/commons.interface';
import { DeleteManyDto } from '@common/dto/delete-many.dto';

export abstract class BaseRepository<T> {
  abstract create?(repository: T): Promise<T>;
  abstract save?(repository: T): Promise<T>;
  abstract findOne?({ where, select, relations }: IFindOne<T>): Promise<T>;
  abstract find?({ where, select, relations, start, limit }: IFind): Promise<PaginatedResult<T>>;
  abstract delete?(identifier: number | string, deletedBy?): Promise<DeleteResult>;
  abstract deleteMany?(deleteDto: DeleteManyDto, deletedBy?): Promise<DeleteResult>;
}
