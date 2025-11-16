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
  BadRequestException,
} from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { Roles } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { RoleEnum } from '@users/infrastructure/enums/role.enum';
import { TrackingsApplicationService } from '@trackings/application/services/trackings.service';
import { Request } from 'express';
import { CreateTrackingDto } from '../dto/create-tracking.dto';
import { UpdateTrackingDto } from '../dto/update-tracking.dto';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryTrackingsDto } from '../dto/pagination-query-trackings.dto';

@Auth(AuthType.Bearer)
@Controller('trackings')
export class TrackingsController {
  constructor(private readonly trackingsApplicationService: TrackingsApplicationService) {}

  @Roles(RoleEnum.Admin)
  @Post()
  create(@Body() createTrackingsDto: CreateTrackingDto, @Req() request: Request) {
    createTrackingsDto.createdBy = request.user?.sub;
    return this.trackingsApplicationService.create(createTrackingsDto);
  }

  @Get()
  findAll(@Query() { start = 0, limit = 100, ...filters }: PaginationQueryTrackingsDto, @Req() request: Request) {
    if (filters.userId) {
      throw new BadRequestException('userId is not a valid query string property');
    }

    if (request.user?.sub && request.user?.role.id !== 1) {
      filters.userId = String(request.user?.sub);
    }

    return this.trackingsApplicationService.findAll({ start, limit, ...filters });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trackingsApplicationService.findOne({ where: { id } });
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrackingsDto: UpdateTrackingDto,
    @Req() request: Request,
  ) {
    updateTrackingsDto.updatedBy = request.user.sub;
    return this.trackingsApplicationService.update(id, updateTrackingsDto);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const deletedBy = request.user.sub;
    return this.trackingsApplicationService.remove(id, deletedBy);
  }

  @Auth(AuthType.Bearer)
  @Roles(RoleEnum.Admin)
  @Post('massive-delete')
  removeMany(@Body() deleteManyDto: DeleteManyDto, @Req() request: Request) {
    const deletedBy = request.user.sub;
    return this.trackingsApplicationService.removeMany(deleteManyDto, deletedBy);
  }
}
