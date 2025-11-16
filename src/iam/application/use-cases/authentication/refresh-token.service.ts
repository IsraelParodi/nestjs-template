import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '@iam/presenters/dto/iam/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@iam/infrastructure/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from '@iam/infrastructure/refresh-token-ids.storage';
import { ActiveUserData } from '@iam/infrastructure/interfaces/active-user-data.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { UserRepository } from '@users/application/ports/outbound/user.repository';

@Injectable()
export class RefreshTokenService implements RefreshTokenService {
  private readonly logger: Logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(dto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(dto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      let user;

      const isValid = await this.refreshTokenIdsStorage.validate(
        sub,
        refreshTokenId,
      );

      if (isValid) {
        user = await this.userRepository.findById(sub);
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new UnauthorizedException('Refresh token is invalid');
      }

      return this.authenticationService.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }
}
