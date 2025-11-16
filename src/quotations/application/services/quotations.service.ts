import { Injectable } from '@nestjs/common';
import { CreateQuotationsDto } from '../../presenters/dto/create-quotations.dto';
import { QuotationsDomainService } from '@quotations/domain/services/quotations.service';
import { IFindOne } from '@common/interfaces/commons.interface';
import { Quotations } from '@quotations/domain/quotations';
import { UpdateQuotationsDto } from '@quotations/presenters/dto/update-quotations.dto';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryQuotationsDto } from '@quotations/presenters/dto/pagination-query-quotations.dto';

@Injectable()
export class QuotationsApplicationService {
  constructor(private readonly quotationsDomainService: QuotationsDomainService) {}

  async create(createQuotationsDto: CreateQuotationsDto) {
    return await this.quotationsDomainService.create(createQuotationsDto);
  }

  findAll(paginationQueryDto: PaginationQueryQuotationsDto) {
    return this.quotationsDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<Quotations>) {
    return this.quotationsDomainService.findOne({
      where,
      relations,
      select,
    });
  }

  update(id: number, updateQuotationsDto: UpdateQuotationsDto) {
    return this.quotationsDomainService.update(id, updateQuotationsDto);
  }

  remove(id: number) {
    return this.quotationsDomainService.remove(id);
  }

  removeMany(deleteManyDto: DeleteManyDto, deletedBy: number) {
    return this.quotationsDomainService.removeMany(deleteManyDto, deletedBy);
  }
}
