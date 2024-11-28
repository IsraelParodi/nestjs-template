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
import { RolesApplicationService } from '@iam/application/services/roles.service';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@users/infrastructure/enums/role.enum';
import { CreateRoleDto } from '../dto/roles/create-role.dto';
import { UpdateRoleDto } from '../dto/roles/update-role.dto';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';

@Auth(AuthType.Bearer)
@Roles(RoleEnum.Admin)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesApplicationService: RolesApplicationService,
  ) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesApplicationService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() { start = 0, limit = 10 }: PaginationQueryDto) {
    return this.rolesApplicationService.findAll({ start, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesApplicationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesApplicationService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesApplicationService.remove(+id);
  }
}
