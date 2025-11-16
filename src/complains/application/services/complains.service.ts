import { Injectable } from '@nestjs/common';
import { CreateComplainsDto } from '../../presenters/dto/create-complains.dto';
import { ComplainsDomainService } from '@complains/domain/services/complains.service';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';
import { Complains } from '@complains/domain/complains';
import { UpdateComplainsDto } from '@complains/presenters/dto/update-complains.dto';

@Injectable()
export class ComplainsApplicationService {
  constructor(private readonly complainsDomainService: ComplainsDomainService) {}

  async create(createComplainsDto: CreateComplainsDto) {
    return await this.complainsDomainService.create(createComplainsDto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.complainsDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<Complains>) {
    return this.complainsDomainService.findOne({
      where,
      relations,
      select,
    });
  }

  update(id: number, updateComplainsDto: UpdateComplainsDto) {
    return this.complainsDomainService.update(id, updateComplainsDto);
  }

  remove(id: number) {
    return this.complainsDomainService.remove(id);
  }
}
