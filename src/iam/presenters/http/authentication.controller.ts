import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationApplicationService } from '@iam/application/services/authentication.service';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { RefreshTokenDto } from '@iam/presenters/dto/iam/refresh-token.dto';
import { SignInDto } from '@iam/presenters/dto/iam/sign-in.dto';
import { SignUpDto } from '@iam/presenters/dto/iam/sign-up.dto';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationApplicationService: AuthenticationApplicationService,
  ) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authenticationApplicationService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authenticationApplicationService.signIn(signInDto);
    return { accessToken, refreshToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authenticationApplicationService.refreshTokens(refreshTokenDto);
  }
}
