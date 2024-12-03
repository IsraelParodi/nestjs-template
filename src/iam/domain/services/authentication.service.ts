import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from 'src/iam/presenters/dto/iam/refresh-token.dto';
import { SignInDto } from 'src/iam/presenters/dto/iam/sign-in.dto';
import { SignUpDto } from 'src/iam/presenters/dto/iam/sign-up.dto';
import {
  RefreshTokenIdsStorage,
  InvalidatedRefreshTokenError,
} from 'src/iam/infrastructure/refresh-token-ids.storage';
import jwtConfig from 'src/iam/infrastructure/config/jwt.config';
import { HashingService } from 'src/iam/infrastructure/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/infrastructure/interfaces/active-user-data.interface';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { User } from 'src/users/domain/user';
import { Role } from 'src/users/domain/role';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class AuthenticationDomainService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      await this.roleRepository.findOne({ where: { id: signUpDto.role } });
      const user = new User();
      const role = new Role(signUpDto.role);
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      user.role = role;

      await this.usersRepository.create(user);
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
    const user = await this.usersRepository.findOne({
      where: { email: signInDto.email },
      relations: ['role', 'role.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    return await this.generateTokens(user);
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

      const user = await this.usersRepository.findOne({
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
