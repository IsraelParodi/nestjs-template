import { Injectable } from '@nestjs/common';
import { TokenRepository } from '../domain/repositories/token.repository';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly refreshTokenRepository: TokenRepository) {}

  async insert(userId: number, tokenId: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.create({
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
    await this.refreshTokenRepository.delete(userId);
  }
}
