import { Injectable, Logger } from '@nestjs/common';
import { IFindOne } from '@common/interfaces/commons.interface';
import { SeaPort } from '../sea-port';
import { SeaPortsRepository } from '../repositories/sea-ports.repository';
import { PaginationQuerySeaPortsDto } from '@sea-ports/presenters/dto/pagination-query-sea-ports.dto';
import { ILike } from 'typeorm';

@Injectable()
export class SeaPortsDomainService {
  private readonly logger = new Logger(SeaPortsDomainService.name);

  constructor(private readonly seaPortsRepository: SeaPortsRepository) {}

  findAll({ start, limit, ...filters }: PaginationQuerySeaPortsDto) {
    const where: any = {};
    const { sortBy = 'id', order = 'ASC' } = filters;

    if (filters.name) where.name = ILike(`${filters.name}%`);
    if (filters.unlocode) {
      where.iso2Country = filters.unlocode.slice(0, 2);
      where.location = filters.unlocode.slice(-3);
    }

    return this.seaPortsRepository.find({ start, limit, where, order: { [sortBy]: order }, relations: ['country'] });
  }

  async findOne({ where, relations, select }: IFindOne<SeaPort>) {
    const port = await this.seaPortsRepository.findOne({ where, relations: ['country'], select });
    return port;
  }
}
