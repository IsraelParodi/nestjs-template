import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@common/infrastructure/enums/role.enum';
import { Request } from 'express';
import { CreateContactUsDto } from '../dto/create-contact-us.dto';
import { DeleteManyDto } from '@common/presenters/dto/delete-many.dto';
import { PaginationQueryContactUsDto } from '../dto/pagination-query-contact-us.dto';
import { CreateContactUsUseCase } from '@contact-us/application/ports/inbound/create-contact-us.use-case';
import { ContactUsMapper } from '@contact-us/infrastructure/adapters/orm/mappers/contact-us.mapper';
import { ListContactUsUseCase } from '@contact-us/application/ports/inbound/list-contact-us.use-case';
import { GetContactUsUseCase } from '@contact-us/application/ports/inbound/get-contact-us.use-case';
import { DeleteContactUsUseCase } from '@contact-us/application/ports/inbound/delete-contact-us.use-case';
import { DeleteManyContactUsUseCase } from '@contact-us/application/ports/inbound/delete-many-contact-us.use-case';

@Auth(AuthType.None)
@Controller('contact-us')
export class ContactUsController {
  constructor(
    private readonly createContactUsUseCase: CreateContactUsUseCase,
    private readonly listContactUsUseCase: ListContactUsUseCase,
    private readonly getContactUsUseCase: GetContactUsUseCase,
    private readonly deleteContactUsUseCase: DeleteContactUsUseCase,
    private readonly deleteManyContactUsUseCase: DeleteManyContactUsUseCase,
  ) {}

  @Post()
  create(
    @Body() createContactUsDto: CreateContactUsDto,
    @Req() request: Request,
  ) {
    if (!createContactUsDto.createdBy) {
      createContactUsDto.createdBy = request.user?.sub;
    }
    const contactUs = ContactUsMapper.fromDtotoDomain(createContactUsDto);
    return this.createContactUsUseCase.execute(contactUs);
  }

  @Get()
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  findAll(
    @Query()
    { page = 1, limit = 100, ...filters }: PaginationQueryContactUsDto,
  ) {
    return this.listContactUsUseCase.execute({
      page,
      limit,
      ...filters,
    });
  }

  @Get(':id')
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getContactUsUseCase.execute(id);
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const deletedBy = request.user.sub;
    await this.deleteContactUsUseCase.execute(id, deletedBy);
    return { message: 'Deleted Successfully', id };
  }

  @Post('massive-delete')
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @HttpCode(HttpStatus.OK)
  async removeMany(
    @Body() deleteManyDto: DeleteManyDto,
    @Req() request: Request,
  ) {
    const deletedBy = request.user.sub;
    await this.deleteManyContactUsUseCase.execute(deleteManyDto.ids, deletedBy);
    return { message: 'Deleted Successfully', id: deleteManyDto.ids };
  }
}
