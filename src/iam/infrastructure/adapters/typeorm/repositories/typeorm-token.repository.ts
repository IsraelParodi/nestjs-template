import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '@iam/domain/entities/token';
import { TokenMapper } from '../mappers/token.mapper';
import { TokenEntity } from '../entities/token.entity';
import { TokenRepository } from '@iam/application/ports/outbound/token.repository';

@Injectable()
export class TypeOrmTokenRepository implements TokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async save(token: Token): Promise<Token> {
    const persistenceModel = TokenMapper.toPersistence(token);
    const newEntity = await this.tokenRepository.save(persistenceModel);

    return TokenMapper.toDomain(newEntity);
  }

  async findByUserId(userId: number): Promise<Token> {
    const entity = await this.tokenRepository.findOne({
      where: { userId },
    });

    return entity;
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.tokenRepository.delete({ userId });
  }

  async create(token: Token): Promise<Token> {
    return this.tokenRepository.create(token);
  }
}
