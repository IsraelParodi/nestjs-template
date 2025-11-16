import { Quotations } from '@quotations/domain/quotations';
import { CreateQuotationsDto } from '@quotations/presenters/dto/create-quotations.dto';

export abstract class CreateQuotationTransactionalUseCase {
  abstract execute(
    createQuotationsDto: CreateQuotationsDto,
  ): Promise<Quotations>;
}
