import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '@iam/presenters/dto/iam/refresh-token.dto';
import { SignInDto } from '@iam/presenters/dto/iam/sign-in.dto';
import { SignUpDto } from '@iam/presenters/dto/iam/sign-up.dto';
import { RefreshTokenIdsStorage, InvalidatedRefreshTokenError } from '@iam/infrastructure/refresh-token-ids.storage';
import jwtConfig from '@iam/infrastructure/config/jwt.config';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';
import { ActiveUserData } from '@iam/infrastructure/interfaces/active-user-data.interface';
import { User } from '@users/domain/user';
import { UsersDomainService } from '@users/domain/services/users.service';
import { NotificationsDomainService } from '@notifications/domain/services/notifications.service';
import { NotificationChannelEnum } from '@notifications/infrastructure/enums/notification-channel.enum';
import { NotificationEmailTemplateEnum } from '@notifications/infrastructure/enums/notification-email-templates.enum';
import { SendNotificationType } from '@notifications/infrastructure/types/send-notification.type';
import * as crypto from 'crypto';
import { ResetPasswordRepository } from '../repositories/reset-password.repository';
import { UpdateUserDto } from '@users/presenters/dto/update-user.dto';
import { BO_URL } from '@common/common.constants';

@Injectable()
export class AuthenticationDomainService {
  constructor(
    private readonly userDomainService: UsersDomainService,
    private readonly notificationService: NotificationsDomainService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly resetPasswordRepository: ResetPasswordRepository,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      await this.userDomainService.create(signUpDto);

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
      const user = await this.userDomainService.findOne({
        where: { email: signInDto.email },
        relations: ['role', 'role.permissions'],
      });

      const isEqual = await this.hashingService.compare(signInDto.password, user.password);

      if (!isEqual) {
        throw new UnauthorizedException('Email or Password does not match');
      }

      return await this.generateTokens(user);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      await this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
        role: user.role,
      }),
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

      const user = await this.userDomainService.findOne({
        where: { id: sub },
      });

      const isValid = await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);

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

  async forgotPassword(email: string) {
    const user = await this.userDomainService.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const tokenFound = await this.resetPasswordRepository.findOne({ where: { email } });
    const token = crypto.randomBytes(32).toString('hex');
    const resetLink = `${BO_URL()[process.env.NODE_ENV]}/auth/reset-password?token=${token}`;

    if (tokenFound) {
      tokenFound.token = token;
      await this.resetPasswordRepository.save(tokenFound);
    } else {
      await this.resetPasswordRepository.save({ email, token });
    }

    console.log(`Send this link to the user: ${resetLink}`);

    const paramsNotificationEmailSend: SendNotificationType = {
      channel: NotificationChannelEnum.EMAIL,
      recipient: email,
      subject: 'Melvan - Solicitud de cambio de contraseña',
      templateId: NotificationEmailTemplateEnum.USER_FORGOT_PASSWORD,
      message: { body: { changePasswordUrl: resetLink } },
    };

    await this.notificationService.send(paramsNotificationEmailSend);
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.resetPasswordRepository.findOne({ where: { token } });
    if (!resetToken) throw new BadRequestException('Invalid or expired token');

    const user = await this.userDomainService.findOne({ where: { email: resetToken.email }, select: { id: true } });
    if (!user) throw new NotFoundException('User not found');

    const updateUserDto = new UpdateUserDto();
    updateUserDto.password = newPassword;
    await this.userDomainService.update(user.id, updateUserDto);
    await this.resetPasswordRepository.delete(resetToken.token);

    const paramsNotificationEmailSend: SendNotificationType = {
      channel: NotificationChannelEnum.EMAIL,
      recipient: resetToken.email,
      subject: 'Melvan - Datos de acceso actualizados',
      templateId: NotificationEmailTemplateEnum.USER_ACCESS_CHANGE,
      message: { body: {} },
    };

    await this.notificationService.send(paramsNotificationEmailSend);
  }
}
