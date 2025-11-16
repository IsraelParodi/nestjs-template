import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '@iam/presenters/dto/iam/refresh-token.dto';
import { SignInDto } from '@iam/presenters/dto/iam/sign-in.dto';
import { SignUpDto } from '@iam/presenters/dto/iam/sign-up.dto';
import { AuthenticationDomainService } from '@iam/domain/services/authentication.service';
import { ResetPasswordDto } from '@iam/presenters/dto/iam/reset-password.dto';
import { ForgotPasswordDto } from '@iam/presenters/dto/iam/forgot-password.dto';

@Injectable()
export class AuthenticationApplicationService {
  private readonly logger: Logger = new Logger(AuthenticationApplicationService.name);

  constructor(private readonly authenticationDomainService: AuthenticationDomainService) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      return await this.authenticationDomainService.signUp(signUpDto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async signIn(signInDto: SignInDto) {
    return await this.authenticationDomainService.signIn(signInDto);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      return await this.authenticationDomainService.refreshTokens(refreshTokenDto);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.authenticationDomainService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.authenticationDomainService.forgotPassword(forgotPasswordDto.email);
  }
}
