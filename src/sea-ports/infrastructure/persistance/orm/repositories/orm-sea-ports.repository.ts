import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFind, IFindOne, PaginatedResult } from '@common/interfaces/commons.interface';
import { PageableService } from '@common/services/pageable.service';
import { SeaPortEntity } from '../entities/sea-port.entity';
import { SeaPortsRepository } from '@sea-ports/domain/repositories/sea-ports.repository';
import { SeaPort } from '@sea-ports/domain/sea-port';
import { SeaPortMapper } from '../mappers/sea-port.mapper';

@Injectable()
export class OrmSeaPortsRepository implements SeaPortsRepository {
  constructor(
    @InjectRepository(SeaPortEntity)
    private readonly seaPortsRepository: Repository<SeaPortEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async findOne({ where, relations, select }: IFindOne<SeaPort>): Promise<SeaPort> {
    const wherePersistance = SeaPortMapper.toPersistence(where);
    const entity = await this.seaPortsRepository.findOne({
      where: wherePersistance,
      relations,
      select,
    });

    const criteria = Object.entries(where)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    if (!entity) {
      throw new NotFoundException(`Sea Port not found for criteria: ${criteria}`);
    }

    return SeaPortMapper.toDomain(entity);
  }

  async find({ where, relations, start, limit, order }: IFind): Promise<PaginatedResult<SeaPort>> {
    const [seaPorts, total] = await this.seaPortsRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
      order,
    });

    const data = seaPorts.map((role) => SeaPortMapper.toDomain(role));

    return this.pageableService.getPages({ data, total, start, limit });
  }
}
