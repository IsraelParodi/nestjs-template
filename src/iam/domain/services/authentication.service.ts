import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '@iam/presenters/dto/iam/refresh-token.dto';
import { SignInDto } from '@iam/presenters/dto/iam/sign-in.dto';
import { SignUpDto } from '@iam/presenters/dto/iam/sign-up.dto';
import {
  RefreshTokenIdsStorage,
  InvalidatedRefreshTokenError,
} from '@iam/infrastructure/refresh-token-ids.storage';
import jwtConfig from '@iam/infrastructure/config/jwt.config';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';
import { ActiveUserData } from '@iam/infrastructure/interfaces/active-user-data.interface';
import { User } from '@users/domain/user';
import { UsersDomainService } from '@users/domain/services/users.service';
import { RolesDomainService } from './roles.service';

@Injectable()
export class AuthenticationDomainService {
  constructor(
    private readonly userService: UsersDomainService,
    private readonly roleService: RolesDomainService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      await this.userService.create(signUpDto);
      return { message: 'User created successfully' };
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505';
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userService.findOne({
        where: { email: signInDto.email },
        relations: ['role', 'role.permissions'],
      });

      const isEqual = await this.hashingService.compare(
        signInDto.password,
        user.password,
      );

      if (!isEqual) {
        throw new UnauthorizedException('Password does not match');
      }

      return await this.generateTokens(user);
    } catch (error) {
      throw error;
    }
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      await this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          role: user.role,
        },
      ),
      await this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.userService.findOne({
        where: { id: sub },
      });

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new UnauthorizedException('Refresh token is invalid');
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }
}
