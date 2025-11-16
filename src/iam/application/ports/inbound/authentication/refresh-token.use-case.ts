import { RefreshTokenDto } from '@iam/presenters/dto/iam/refresh-token.dto';

export abstract class RefreshTokenUseCase {
  abstract execute(dto: RefreshTokenDto);
}
