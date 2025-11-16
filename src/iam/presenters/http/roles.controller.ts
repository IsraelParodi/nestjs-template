import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@common/infrastructure/enums/role.enum';
import { CreateRoleDto } from '../dto/roles/create-role.dto';
import { UpdateRoleDto } from '../dto/roles/update-role.dto';
import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { UpdateRoleCommand } from '@iam/application/commands/roles/update-role.command';
import { CreateRoleCommand } from '@iam/application/commands/roles/create-role.command';
import { CreateRoleUseCase } from '@iam/application/ports/inbound/roles/create-role.use-case';
import { ListRolesUseCase } from '@iam/application/ports/inbound/roles/list-roles.use-case';
import { GetRoleUseCase } from '@iam/application/ports/inbound/roles/get-role.use-case';
import { UpdateRoleUseCase } from '@iam/application/ports/inbound/roles/update-role.use-case';
import { DeleteRoleUseCase } from '@iam/application/ports/inbound/roles/delete-role.use-case';

@Auth(AuthType.Bearer)
@Roles(RoleEnum.Admin)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly UpdateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    const command: CreateRoleCommand = {
      name: dto.name,
      description: dto.description,
      permissions: dto.permissions,
    };
    return this.createRoleUseCase.execute(command);
  }

  @Get()
  findAll(@Query() { page = 1, limit = 10 }: PaginationQueryDto) {
    return this.listRolesUseCase.execute({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getRoleUseCase.execute(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const command: UpdateRoleCommand = {
      name: dto.name,
      description: dto.description,
      permissions: dto.permissions,
    };

    return this.UpdateRoleUseCase.execute(+id, command);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteRoleUseCase.execute(+id);
    return { message: 'Deleted Successfully', id: +id };
  }
}
