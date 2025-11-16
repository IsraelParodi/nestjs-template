import { Injectable } from '@nestjs/common';
import { IFindOne } from '@common/interfaces/commons.interface';
import { SeaPort } from '@sea-ports/domain/sea-port';
import { SeaPortsDomainService } from '@sea-ports/domain/services/sea-ports.service';
import { PaginationQuerySeaPortsDto } from '@sea-ports/presenters/dto/pagination-query-sea-ports.dto';

@Injectable()
export class SeaPortsApplicationService {
  constructor(private readonly seaPortsDomainService: SeaPortsDomainService) {}

  findAll(paginationQueryDto: PaginationQuerySeaPortsDto) {
    return this.seaPortsDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<SeaPort>) {
    return this.seaPortsDomainService.findOne({ where, relations, select });
  }
}
