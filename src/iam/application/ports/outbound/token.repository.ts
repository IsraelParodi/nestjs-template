// @iam/application/ports/token.repository.port.ts

import { Token } from '@iam/domain/entities/token';

export abstract class TokenRepository {
  abstract save(token: Token): Promise<Token>;
  abstract create(token: Token): Promise<Token>;
  abstract findByUserId(userId: number): Promise<Token | null>;
  abstract deleteByUserId(userId: number): Promise<void>;
}
