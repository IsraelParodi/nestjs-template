import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { RoleEnum } from '@common/infrastructure/enums/role.enum';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthInspectorService } from '@common/services/auth-inspector.service';

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
