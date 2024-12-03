import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationApplicationService } from 'src/iam/application/services/authentication.service';
import { Auth } from 'src/iam/infrastructure/decorators/auth.decorator';
import { RefreshTokenDto } from 'src/iam/presenters/http/dto/refresh-token.dto';
import { SignInDto } from 'src/iam/presenters/http/dto/sign-in.dto';
import { SignUpDto } from 'src/iam/presenters/http/dto/sign-up.dto';
import { AuthType } from 'src/iam/infrastructure/enum/auth-type.enum';

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
    // response.cookie('accessToken', accessToken, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });
    // response.cookie('refreshToken', refreshToken, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });
  }

  @HttpCode(HttpStatus.OK) // changed since the default is 201
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authenticationApplicationService.refreshTokens(refreshTokenDto);
  }
}
