import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthInspectorService } from '../services/auth-inspector.service';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { RoleEnum } from '@users/infrastructure/enums/role.enum';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';

@Controller('common')
@Auth(AuthType.Bearer)
export class CommonController {
  constructor(private readonly authInspectorService: AuthInspectorService) {}

  @Get('auth-inspector')
  getAuthMap() {
    return this.authInspectorService.getAuthMetadata();
  }

  @Get('/slow')
  @Roles(RoleEnum.Admin, RoleEnum.Customer)
  async getSlow() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  @Get('string-error')
  throwStringError() {
    throw new HttpException('Custom string error', HttpStatus.BAD_REQUEST);
  }
}
