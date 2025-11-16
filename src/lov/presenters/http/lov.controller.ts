import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@common/infrastructure/enums/role.enum';
import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { Request } from 'express';
import { CreateListOfValuesDto } from '../dto/create-lov.dto';
import { UpdateListOfValuesDto } from '../dto/update-lov.dto';
import { CreateListOfValuesDetailDto } from '../dto/create-lov-detail.dto';
import { UpdateListOfValuesDetailDto } from '../dto/update-lov-detail.dto';
import { CreateLovUseCase } from '@lov/application/ports/inbound/create-lov.use-case';
import { ListLovUseCase } from '@lov/application/ports/inbound/list-lov.use-case';
import { GetLovUseCase } from '@lov/application/ports/inbound/get-lov.use-case';
import { UpdateLovUseCase } from '@lov/application/ports/inbound/update-lov.use-case';
import { DeleteLovUseCase } from '@lov/application/ports/inbound/delete-lov.use-case';
import { CreateLovDetailUseCase } from '@lov/application/ports/inbound/create-lov-detail.use-case';
import { UpdateLovDetailUseCase } from '@lov/application/ports/inbound/update-lov-detail.use-case';
import { DeleteLovDetailUseCase } from '@lov/application/ports/inbound/delete-lov-detail.use-case';

@Controller('lov')
export class ListOfValuesController {
  constructor(
    private readonly createLovUseCase: CreateLovUseCase,
    private readonly listLovUseCase: ListLovUseCase,
    private readonly getLovUseCase: GetLovUseCase,
    private readonly updateLovUseCase: UpdateLovUseCase,
    private readonly deleteLovUseCase: DeleteLovUseCase,
    private readonly createLovDetailUseCase: CreateLovDetailUseCase,
    private readonly updateLovDetailUseCase: UpdateLovDetailUseCase,
    private readonly deleteLovDetailUseCase: DeleteLovDetailUseCase,
  ) {}

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Post()
  createLov(
    @Body() createListOfValuesDto: CreateListOfValuesDto,
    @Req() request: Request,
  ) {
    createListOfValuesDto.createdBy = request.user.sub;
    return this.createLovUseCase.execute(createListOfValuesDto);
  }

  @Auth(AuthType.None)
  @Get()
  findAllLov(@Query() { page = 1, limit = 100 }: PaginationQueryDto) {
    return this.listLovUseCase.execute({ page, limit });
  }

  @Auth(AuthType.None)
  @Get(':key')
  findOneLov(@Param('key') key: string) {
    return this.getLovUseCase.execute(key);
  }

  @Auth(AuthType.Bearer)
  @Patch(':id')
  updateLov(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListOfValuesDto: UpdateListOfValuesDto,
    @Req() request: Request,
  ) {
    updateListOfValuesDto.updatedBy = request.user.sub;
    return this.updateLovUseCase.execute(id, updateListOfValuesDto);
  }

  @Auth(AuthType.Bearer)
  @Delete(':id')
  async removeLov(@Param('id', ParseIntPipe) id: number) {
    await this.deleteLovUseCase.execute(id);
    return { message: 'Deleted Successfully', id };
  }

  @Auth(AuthType.Bearer)
  @Post(':key/details')
  createLovDetail(
    @Req() request: Request,
    @Param('key') key: string,
    @Body() createListOfValuesDetailDto: CreateListOfValuesDetailDto,
  ) {
    createListOfValuesDetailDto.createdBy = request.user.sub;
    return this.createLovDetailUseCase.execute(
      createListOfValuesDetailDto,
      key,
    );
  }

  @Auth(AuthType.Bearer)
  @Patch('details/:id')
  updateLovDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListOfValuesDetailDto: UpdateListOfValuesDetailDto,
    @Req() request: Request,
  ) {
    updateListOfValuesDetailDto.updatedBy = request.user.sub;
    return this.updateLovDetailUseCase.execute(id, updateListOfValuesDetailDto);
  }

  @Auth(AuthType.Bearer)
  @Delete('details/:id')
  async removeLovDetail(@Param('id', ParseIntPipe) id: number) {
    await this.deleteLovDetailUseCase.execute(id);
    return { message: 'Deleted Successfully', id };
  }
}
