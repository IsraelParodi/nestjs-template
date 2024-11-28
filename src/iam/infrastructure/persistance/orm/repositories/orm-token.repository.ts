import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TokenRepository } from '@iam/domain/repositories/token.repository';
import { Token } from '@iam/domain/token';
import { TokenMapper } from '../mappers/token.mapper';
import { TokenEntity } from '../entities/token.entity';
import { IFind, PaginatedResult } from '@common/interfaces/commons.interface';

@Injectable()
export class OrmTokenRepository implements TokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async save(token: Token): Promise<Token> {
    const persistenceModel = TokenMapper.toPersistence(token);
    const newEntity = await this.tokenRepository.save(persistenceModel);

    return TokenMapper.toDomain(newEntity);
  }

  async create(token: Token): Promise<Token> {
    return this.tokenRepository.create(token);
  }

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<Token>> {
    const [tokens, total] = await this.tokenRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
    });

    return {
      data: tokens.map((role) => TokenMapper.toDomain(role)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne({
    where,
    relations,
  }: {
    where: object;
    relations: string[];
  }): Promise<Token> {
    const entity = await this.tokenRepository.findOne({ where, relations });
    return TokenMapper.toDomain(entity);
  }

  async delete(userId: number): Promise<DeleteResult> {
    return this.tokenRepository.delete({ userId });
  }
}
