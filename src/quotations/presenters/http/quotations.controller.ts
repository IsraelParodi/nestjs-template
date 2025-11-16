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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@common/infrastructure/enums/role.enum';
import { Request } from 'express';
import { CreateQuotationsDto } from '../dto/create-quotations.dto';
import { UpdateQuotationsDto } from '../dto/update-quotations.dto';
import { DeleteManyDto } from '@common/presenters/dto/delete-many.dto';
import { PaginationQueryQuotationsDto } from '../dto/pagination-query-quotations.dto';
import { CreateQuotationUseCase } from '@quotations/application/ports/inbound/create-quotation.use-case';
import { DeleteManyQuotationsUseCase } from '@quotations/application/ports/inbound/delete-many-quotations.use-case';
import { DeleteQuotationUseCase } from '@quotations/application/ports/inbound/delete-quotation.use-case';
import { GetQuotationUseCase } from '@quotations/application/ports/inbound/get-quotation.use-case';
import { ListQuotationUseCase } from '@quotations/application/ports/inbound/list-quotations.use-case';
import { UpdateQuotationUseCase } from '@quotations/application/ports/inbound/update-quotation.use-case';
import { CreateQuotationTransactionalUseCase } from '@quotations/application/ports/inbound/create-quotation-transactional.use-case';

@Auth(AuthType.None)
@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly createQuotationUseCase: CreateQuotationUseCase,
    private readonly createQuotationTransactionalUseCase: CreateQuotationTransactionalUseCase,
    private readonly deleteManyQuotationsUseCase: DeleteManyQuotationsUseCase,
    private readonly deleteQuotationUseCase: DeleteQuotationUseCase,
    private readonly getQuotationUseCase: GetQuotationUseCase,
    private readonly listQuotationUseCase: ListQuotationUseCase,
    private readonly updateQuotationUseCase: UpdateQuotationUseCase,
  ) {}

  @Post()
  createTransactional(
    @Body() createQuotationsDto: CreateQuotationsDto,
    @Req() request: Request,
  ) {
    createQuotationsDto.createdBy = request.user?.sub;
    return this.createQuotationTransactionalUseCase.execute(
      createQuotationsDto,
    );
  }

  @Post('create-without-transaction')
  createWithoutTransaction(
    @Body() createQuotationsDto: CreateQuotationsDto,
    @Req() request: Request,
  ) {
    createQuotationsDto.createdBy = request.user?.sub;
    return this.createQuotationUseCase.execute(createQuotationsDto);
  }

  @Get()
  findAll(
    @Query()
    { page = 1, limit = 100, ...filters }: PaginationQueryQuotationsDto,
  ) {
    return this.listQuotationUseCase.execute({
      page,
      limit,
      ...filters,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getQuotationUseCase.execute(id);
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
    return this.updateQuotationUseCase.execute(id, updateQuotationsDto);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteQuotationUseCase.execute(id);
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
    await this.deleteManyQuotationsUseCase.execute(
      deleteManyDto.ids,
      deletedBy,
    );
    return { message: 'Deleted Successfully', id: deleteManyDto.ids };
  }
}
