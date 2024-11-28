import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { CreateUserDto } from '@users/presenters/dto/create-user.dto';
import { UpdateUserDto } from '@users/presenters/dto/update-user.dto';
import { UsersApplicationService } from '@users/application/services/users.service';

import { RoleEnum } from '@users/infrastructure/enums/role.enum';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';

@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersApplicationService: UsersApplicationService,
  ) {}

  @Roles(RoleEnum.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() request: any) {
    createUserDto.createdBy = request.user.sub;
    return this.usersApplicationService.create(createUserDto);
  }

  @Get()
  findAll(@Query() { start = 0, limit = 10 }: PaginationQueryDto) {
    return this.usersApplicationService.findAll({ start, limit });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersApplicationService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: any,
  ) {
    updateUserDto.updatedBy = request.user.sub;
    return this.usersApplicationService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersApplicationService.remove(+id);
  }
}
