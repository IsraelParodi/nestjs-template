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
import { Request } from 'express';
import { DeleteManyDto } from '../../../common/dto/delete-many.dto';
import { PaginationQueryUsersDto } from '../dto/pagination-query-users.dto';

@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersApplicationService: UsersApplicationService,
  ) {}

  @Roles(RoleEnum.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    createUserDto.createdBy = request.user.sub;
    return this.usersApplicationService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryUsersDto) {
    return this.usersApplicationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersApplicationService.findOne({
      where: { id },
      select: {
        id: true,
        address: true,
        businessTaxId: true,
        email: true,
        lastname: true,
        legalName: true,
        name: true,
        phone: true,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    updateUserDto.updatedBy = request.user.sub;
    return this.usersApplicationService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersApplicationService.remove(id);
  }

  @Post('massive-delete')
  removeMany(@Body() deleteUserDto: DeleteManyDto, @Req() request: Request) {
    const deletedBy = request.user.sub;
    return this.usersApplicationService.removeMany(deleteUserDto, deletedBy);
  }
}
