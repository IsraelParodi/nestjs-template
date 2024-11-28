import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Token } from './entities/token.entity';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(
    @InjectRepository(Token)
    private readonly refreshTokenRepository: Repository<Token>,
    private readonly dataSource: DataSource,
  ) {}

  async insert(userId: number, tokenId: string): Promise<void> {
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      tokenId,
    });
    await this.refreshTokenRepository.save(refreshToken);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { userId, tokenId },
    });

    if (!storedToken) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedToken.tokenId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }
}
