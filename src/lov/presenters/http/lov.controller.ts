import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, ParseIntPipe } from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@users/infrastructure/enums/role.enum';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { Request } from 'express';
import { CreateListOfValuesDto } from '../dto/create-lov.dto';
import { UpdateListOfValuesDto } from '../dto/update-lov.dto';
import { ListOfValuesApplicationService } from '@lov/application/services/lov.service';
import { ListOfValuesDetailApplicationService } from '@lov/application/services/lov-detail.service';
import { CreateListOfValuesDetailDto } from '../dto/create-lov-detail.dto';
import { UpdateListOfValuesDetailDto } from '../dto/update-lov-detail.dto';

@Controller('lov')
export class ListOfValuesController {
  constructor(
    private readonly listOfValuesApplicationService: ListOfValuesApplicationService,
    private readonly listOfValuesDetailApplicationService: ListOfValuesDetailApplicationService,
  ) {}

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Post()
  createLov(@Body() createListOfValuesDto: CreateListOfValuesDto, @Req() request: Request) {
    createListOfValuesDto.createdBy = request.user.sub;
    return this.listOfValuesApplicationService.create(createListOfValuesDto);
  }

  @Auth(AuthType.None)
  @Get()
  findAllLov(@Query() { start = 0, limit = 100 }: PaginationQueryDto) {
    return this.listOfValuesApplicationService.findAll({ start, limit });
  }

  @Auth(AuthType.None)
  @Get(':key')
  findOneLov(@Param('key') key: string) {
    return this.listOfValuesApplicationService.findOne({
      where: { key },
      relations: ['values', 'createdBy'],
    });
  }

  @Auth(AuthType.Bearer)
  @Patch(':id')
  updateLov(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListOfValuesDto: UpdateListOfValuesDto,
    @Req() request: Request,
  ) {
    updateListOfValuesDto.updatedBy = request.user.sub;
    return this.listOfValuesApplicationService.update(id, updateListOfValuesDto);
  }

  @Auth(AuthType.Bearer)
  @Delete(':id')
  removeLov(@Param('id', ParseIntPipe) id: number) {
    return this.listOfValuesApplicationService.remove(id);
  }

  @Auth(AuthType.Bearer)
  @Post(':key/details')
  createLovDetail(
    @Req() request: Request,
    @Param('key') key: string,
    @Body() createListOfValuesDetailDto: CreateListOfValuesDetailDto,
  ) {
    createListOfValuesDetailDto.createdBy = request.user.sub;
    return this.listOfValuesDetailApplicationService.create(createListOfValuesDetailDto, key);
  }

  @Auth(AuthType.Bearer)
  @Patch('details/:id')
  updateLovDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListOfValuesDetailDto: UpdateListOfValuesDetailDto,
    @Req() request: Request,
  ) {
    updateListOfValuesDetailDto.updatedBy = request.user.sub;
    return this.listOfValuesDetailApplicationService.update(id, updateListOfValuesDetailDto);
  }

  @Auth(AuthType.Bearer)
  @Delete('details/:id')
  removeLovDetail(@Param('id', ParseIntPipe) id: number) {
    return this.listOfValuesDetailApplicationService.remove(id);
  }
}
