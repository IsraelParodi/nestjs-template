import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Auth } from 'src/iam/infrastructure/decorators/auth.decorator';
import { Roles } from 'src/iam/infrastructure/decorators/roles.decorator';
import { AuthType } from 'src/iam/infrastructure/enum/auth-type.enum';
import { CreateUserDto } from 'src/users/presenters/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/presenters/dto/update-user.dto';
import { UsersApplicationService } from 'src/users/application/services/users.service';

import { RoleEnum } from 'src/users/infrastructure/enums/role.enum';

@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersApplicationService: UsersApplicationService,
  ) {}

  @Roles(RoleEnum.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersApplicationService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersApplicationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersApplicationService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersApplicationService.remove(+id);
  }
}
