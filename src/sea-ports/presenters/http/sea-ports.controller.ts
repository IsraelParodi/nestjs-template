import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { SeaPortsApplicationService } from 'src/sea-ports/application/services/sea-ports.service';
import { PaginationQuerySeaPortsDto } from '../dto/pagination-query-sea-ports.dto';

@Auth(AuthType.None)
@Controller('sea-ports')
export class SeaPortsController {
  constructor(private readonly seaPortsApplicationService: SeaPortsApplicationService) {}

  @Get()
  findAllSeaPorts(@Query() { start = 0, limit = 10, ...filters }: PaginationQuerySeaPortsDto) {
    return this.seaPortsApplicationService.findAll({ start, limit, ...filters });
  }

  @Get(':id')
  findOneSeaPort(@Param('id', ParseIntPipe) id: number) {
    return this.seaPortsApplicationService.findOne({ where: { id } });
  }
}
