import { TokenEntity } from '../entities/token.entity';
import { Token } from '@iam/domain/token';

export class TokenMapper {
  static toDomain(tokenEntity: TokenEntity): Token {
    const token = new Token(tokenEntity.id);

    token.userId = tokenEntity.userId;
    token.tokenId = tokenEntity.tokenId;

    return token;
  }

  static toPersistence(token: Token): TokenEntity {
    const entity = new TokenEntity();

    entity.id = token.id;
    entity.userId = token.userId;
    entity.tokenId = token.tokenId;

    return entity;
  }
}
