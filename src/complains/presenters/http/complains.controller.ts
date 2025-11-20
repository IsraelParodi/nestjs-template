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
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { ComplainsApplicationService } from '@complains/application/services/complains.service';
import { Request } from 'express';
import { CreateComplainsDto } from '../dto/create-complains.dto';
import { UpdateComplainsDto } from '../dto/update-complains.dto';

@Controller('complains')
export class ComplainsController {
  constructor(
    private readonly complainsApplicationService: ComplainsApplicationService,
  ) {}

  @Auth(AuthType.None)
  @Post()
  create(@Body() createComplainsDto: CreateComplainsDto) {
    return this.complainsApplicationService.create(createComplainsDto);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Get()
  findAll(@Query() { start = 0, limit = 100 }: PaginationQueryDto) {
    return this.complainsApplicationService.findAll({ start, limit });
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.complainsApplicationService.findOne({ where: { id } });
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComplainsDto: UpdateComplainsDto,
    @Req() request: Request,
  ) {
    updateComplainsDto.updatedBy = request.user.sub;
    return this.complainsApplicationService.update(id, updateComplainsDto);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.complainsApplicationService.remove(id);
  }
}
