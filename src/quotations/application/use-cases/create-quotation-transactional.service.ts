import { Injectable, Logger } from '@nestjs/common';
import { CreateQuotationsDto } from '@quotations/presenters/dto/create-quotations.dto';
import { Quotations } from '@quotations/domain/quotations';
import { UnitOfWorkPort } from '@common/application/ports/outbound/unit-of-work.port';
import { CreateQuotationTransactionalUseCase } from '../ports/inbound/create-quotation-transactional.use-case';
import { CreateQuotationUseCase } from '../ports/inbound/create-quotation.use-case';

@Injectable()
export class CreateQuotationTransactionalService
  implements CreateQuotationTransactionalUseCase
{
  private readonly logger = new Logger(
    CreateQuotationTransactionalService.name,
  );

  constructor(
    private readonly createQuotationUseCase: CreateQuotationUseCase,
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async execute(dto: CreateQuotationsDto): Promise<Quotations> {
    return this.unitOfWork.execute((manager) =>
      this.createQuotationUseCase.execute(dto, manager),
    );
  }
}
