import { Injectable } from '@nestjs/common';
import { CreateFeeDto } from '../../presenters/dto/create-fees.dto';
import { FeesDomainService } from '@fees/domain/services/fees.service';
import { IFindOne } from '@common/interfaces/commons.interface';
import { Fee } from '@fees/domain/fee';
import { UpdateFeeDto } from '@fees/presenters/dto/update-fees.dto';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryFeesDto } from '@fees/presenters/dto/pagination-query-fees.dto';

@Injectable()
export class FeesApplicationService {
  constructor(private readonly feesDomainService: FeesDomainService) {}

  async create(createFeesDto: CreateFeeDto) {
    return await this.feesDomainService.create(createFeesDto);
  }

  findAll(paginationQueryDto: PaginationQueryFeesDto) {
    return this.feesDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<Fee>) {
    return this.feesDomainService.findOne({
      where,
      relations,
      select,
    });
  }

  update(id: number, updateFeesDto: UpdateFeeDto) {
    return this.feesDomainService.update(id, updateFeesDto);
  }

  remove(id: number) {
    return this.feesDomainService.remove(id);
  }

  removeMany(deleteManyDto: DeleteManyDto, deletedBy: number) {
    return this.feesDomainService.removeMany(deleteManyDto, deletedBy);
  }
}
