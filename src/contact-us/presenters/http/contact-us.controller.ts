import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, Req } from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@users/infrastructure/enums/role.enum';
import { ContactUsApplicationService } from '@contact-us/application/services/contact-us.service';
import { Request } from 'express';
import { CreateContactUsDto } from '../dto/create-contact-us.dto';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryContactUsDto } from '../dto/pagination-query-contact-us.dto';

@Auth(AuthType.None)
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsApplicationService: ContactUsApplicationService) {}

  @Post()
  create(@Body() createContactUsDto: CreateContactUsDto, @Req() request: Request) {
    createContactUsDto.createdBy = request.user?.sub;
    return this.contactUsApplicationService.create(createContactUsDto);
  }

  @Get()
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  findAll(@Query() { start = 0, limit = 100, ...filters }: PaginationQueryContactUsDto) {
    return this.contactUsApplicationService.findAll({ start, limit, ...filters });
  }

  @Get(':id')
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactUsApplicationService.findOne({ where: { id } });
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const deletedBy = request.user.sub;
    return this.contactUsApplicationService.remove(id, deletedBy);
  }

  @Post('massive-delete')
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  removeMany(@Body() deleteManyDto: DeleteManyDto, @Req() request: Request) {
    const deletedBy = request.user.sub;
    return this.contactUsApplicationService.removeMany(deleteManyDto, deletedBy);
  }
}
