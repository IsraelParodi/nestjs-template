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
import { RoleEnum } from '@users/infrastructure/enums/role.enum';
import { QuotationsApplicationService } from '@quotations/application/services/quotations.service';
import { Request } from 'express';
import { CreateQuotationsDto } from '../dto/create-quotations.dto';
import { UpdateQuotationsDto } from '../dto/update-quotations.dto';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryQuotationsDto } from '../dto/pagination-query-quotations.dto';

@Auth(AuthType.None)
@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly quotationsApplicationService: QuotationsApplicationService,
  ) {}

  @Post()
  create(
    @Body() createQuotationsDto: CreateQuotationsDto,
    @Req() request: Request,
  ) {
    createQuotationsDto.createdBy = request.user?.sub;
    return this.quotationsApplicationService.create(createQuotationsDto);
  }

  @Get()
  findAll(
    @Query()
    { start = 0, limit = 100, ...filters }: PaginationQueryQuotationsDto,
  ) {
    return this.quotationsApplicationService.findAll({
      start,
      limit,
      ...filters,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quotationsApplicationService.findOne({ where: { id } });
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuotationsDto: UpdateQuotationsDto,
    @Req() request: Request,
  ) {
    updateQuotationsDto.updatedBy = request.user.sub;
    return this.quotationsApplicationService.update(id, updateQuotationsDto);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quotationsApplicationService.remove(id);
  }

  @Post('massive-delete')
  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  removeMany(@Body() deleteManyDto: DeleteManyDto, @Req() request: Request) {
    const deletedBy = request.user.sub;
    return this.quotationsApplicationService.removeMany(
      deleteManyDto,
      deletedBy,
    );
  }
}
