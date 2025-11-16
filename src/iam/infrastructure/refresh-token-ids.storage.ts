import { TokenRepository } from '@iam/application/ports/outbound/token.repository';
import { Injectable } from '@nestjs/common';

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
    const storedToken = await this.refreshTokenRepository.findByUserId(userId);

    if (!storedToken) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedToken.tokenId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }
}
