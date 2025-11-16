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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';

import { PaginationQueryUsersDto } from '../dto/request/pagination-query-users.dto';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { UserResponseDto } from '../dto/response/get-user.response.dto';

import { CreateUserUseCase } from '@users/application/ports/inbound/create-user.use-case';
import { GetUserUseCase } from '@users/application/ports/inbound/get-user.use-case';
import { ListUsersUseCase } from '@users/application/ports/inbound/list-users.use-case';
import { UpdateUserUseCase } from '@users/application/ports/inbound/update-user.use-case';
import { DeleteUserUseCase } from '@users/application/ports/inbound/delete-user.use-case';
import { DeleteManyUsersUseCase } from '@users/application/ports/inbound/delete-many-users.use-case';

import { CreateUserCommand } from '@users/application/commands/create-user.command';
import { UpdateUserCommand } from '@users/application/commands/update-user.command';
import { RoleEnum } from '@common/infrastructure/enums/role.enum';
import { DeleteManyDto } from '@common/presenters/dto/delete-many.dto';
import { ActiveUser } from '@iam/infrastructure/decorators/active-user.decorator';
import { ListUsersQuery } from '@users/application/queries/list-users.query';

@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly deleteManyUsersUseCase: DeleteManyUsersUseCase,
  ) {}

  @Roles(RoleEnum.Admin)
  @Post()
  async create(@Body() dto: CreateUserDto, @ActiveUser() activeUser) {
    const command: CreateUserCommand = {
      ...dto,
      createdBy: activeUser.sub,
    };

    const user = await this.createUserUseCase.execute(command);
    return new UserResponseDto(user);
  }

  @Get()
  async findAll(
    @Query() { page = 1, limit = 10, ...filters }: PaginationQueryUsersDto,
  ) {
    const query: ListUsersQuery = {
      page,
      limit,
      name: filters?.name,
      lastname: filters?.lastname,
      roleId: Number(filters?.roleId),
    };

    const result = await this.listUsersUseCase.execute(query);

    return {
      ...result,
      data: result.data.map((user) => new UserResponseDto(user)),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.getUserUseCase.execute(id);
    return new UserResponseDto(user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @ActiveUser() activeUser,
  ) {
    const command: UpdateUserCommand = {
      ...dto,
      updatedBy: activeUser.sub,
    };

    const user = await this.updateUserUseCase.execute(id, command);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser,
  ) {
    await this.deleteUserUseCase.execute(id, activeUser.sub);
    return { message: 'Deleted Successfully', id };
  }

  @Roles(RoleEnum.Admin)
  @Post('massive-delete')
  @HttpCode(HttpStatus.OK)
  async removeMany(@Body() dto: DeleteManyDto, @ActiveUser() activeUser) {
    await this.deleteManyUsersUseCase.execute(dto.ids, activeUser.sub);
    return { message: 'Deleted Successfully', ids: dto.ids };
  }
}
