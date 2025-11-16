import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req } from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@users/infrastructure/enums/role.enum';
import { FeesApplicationService } from '@fees/application/services/fees.service';
import { Request } from 'express';
import { CreateFeeDto } from '../dto/create-fees.dto';
import { UpdateFeeDto } from '../dto/update-fees.dto';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryFeesDto } from '../dto/pagination-query-fees.dto';

@Auth(AuthType.None)
@Controller('fees')
export class FeesController {
  constructor(private readonly feesApplicationService: FeesApplicationService) {}

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Post()
  create(@Body() createFeesDto: CreateFeeDto, @Req() request: Request) {
    createFeesDto.createdBy = request.user?.sub;
    return this.feesApplicationService.create(createFeesDto);
  }

  @Get()
  findAll(@Query() { start = 0, limit = 10, ...filters }: PaginationQueryFeesDto) {
    return this.feesApplicationService.findAll({ start, limit, ...filters });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.feesApplicationService.findOne({ where: { id } });
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFeesDto: UpdateFeeDto, @Req() request: Request) {
    updateFeesDto.updatedBy = request.user.sub;
    return this.feesApplicationService.update(id, updateFeesDto);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.feesApplicationService.remove(id);
  }

  @Post('massive-delete')
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  removeMany(@Body() deleteManyDto: DeleteManyDto, @Req() request: Request) {
    const deletedBy = request.user.sub;
    return this.feesApplicationService.removeMany(deleteManyDto, deletedBy);
  }
}
