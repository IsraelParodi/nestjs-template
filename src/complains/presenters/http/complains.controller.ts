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
import { RoleEnum } from '@common/infrastructure/enums/role.enum';
import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { Request } from 'express';
import { CreateComplainsDto } from '../dto/create-complains.dto';
import { UpdateComplainsDto } from '../dto/update-complains.dto';
import { CreateComplainUseCase } from '@complains/application/ports/inbound/create-complain.use-case';
import { ListComplainsUseCase } from '@complains/application/ports/inbound/list-complains.use-case';
import { GetComplainUseCase } from '@complains/application/ports/inbound/get-complain.use-case';
import { UpdateComplainUseCase } from '@complains/application/ports/inbound/update-complain.use-case';
import { DeleteComplainUseCase } from '@complains/application/ports/inbound/delete-complain.use-case';

@Controller('complains')
export class ComplainsController {
  constructor(
    private readonly createComplainUseCase: CreateComplainUseCase,
    private readonly listComplainsUseCase: ListComplainsUseCase,
    private readonly getComplainUseCase: GetComplainUseCase,
    private readonly updateComplainUseCase: UpdateComplainUseCase,
    private readonly deleteComplainUseCase: DeleteComplainUseCase,
  ) {}

  @Auth(AuthType.None)
  @Post()
  create(@Body() createComplainsDto: CreateComplainsDto) {
    return this.createComplainUseCase.execute(createComplainsDto);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Get()
  findAll(@Query() { page = 1, limit = 100 }: PaginationQueryDto) {
    return this.listComplainsUseCase.execute({ page, limit });
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getComplainUseCase.execute(id);
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
    return this.updateComplainUseCase.execute(id, updateComplainsDto);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteComplainUseCase.execute(id);
    return { message: 'Deleted Successfully', id };
  }
}
