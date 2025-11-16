import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { RefreshTokenDto } from '@iam/presenters/dto/iam/refresh-token.dto';
import { SignInDto } from '@iam/presenters/dto/iam/sign-in.dto';
import { SignUpDto } from '@iam/presenters/dto/iam/sign-up.dto';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { ForgotPasswordDto } from '../dto/iam/forgot-password.dto';
import { ResetPasswordDto } from '../dto/iam/reset-password.dto';
import { SignUpCommand } from '@iam/application/commands/authentication/sign-up.command';
import { SignInCommand } from '@iam/application/commands/authentication/sign-in.command';
import { RefreshTokenCommand } from '@iam/application/commands/authentication/refresh-token.command';
import { ForgotPasswordCommand } from '@iam/application/commands/authentication/forgot-password.command';
import { ResetPasswordCommand } from '@iam/application/commands/authentication/reset-password.command';
import { SignUpUseCase } from '@iam/application/ports/inbound/authentication/sign-up.use-case';
import { SignInUseCase } from '@iam/application/ports/inbound/authentication/sign-in.use-case';
import { RefreshTokenUseCase } from '@iam/application/ports/inbound/authentication/refresh-token.use-case';
import { ForgotPasswordUseCase } from '@iam/application/ports/inbound/authentication/forgot-password.use-case';
import { ResetPasswordUseCase } from '@iam/application/ports/inbound/authentication/reset-password.use-case';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    const command: SignUpCommand = {
      email: dto.email,
      password: dto.password,
      name: dto.name,
      lastname: dto.lastname,
      businessTaxId: dto.businessTaxId,
      legalName: dto.legalName,
      country: dto.country,
    };

    return this.signUpUseCase.execute(command);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    const command: SignInCommand = {
      email: dto.email,
      password: dto.password,
    };

    const { accessToken, refreshToken } =
      await this.signInUseCase.execute(command);

    return { accessToken, refreshToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() dto: RefreshTokenDto) {
    const command: RefreshTokenCommand = {
      refreshToken: dto.refreshToken,
    };

    return this.refreshTokenUseCase.execute(command);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const command: ForgotPasswordCommand = {
      email: dto.email,
    };

    return this.forgotPasswordUseCase.execute(command);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const command: ResetPasswordCommand = {
      token: dto.token,
      password: dto.password,
    };

    return this.resetPasswordUseCase.execute(command);
  }
}
