import { IFindOne } from 'src/common/interfaces/commons.interface';
import { Token } from '../token';
import { DeleteResult } from 'typeorm';

export abstract class TokenRepository {
  abstract create(user: Token): Promise<Token>;
  abstract save(user: Token): Promise<Token>;
  abstract findOne({ where, relations }: IFindOne<Token>): Promise<Token>;
  abstract delete(userId: number): Promise<DeleteResult>;
}
