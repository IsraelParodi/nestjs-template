import { Quotations } from '@quotations/domain/quotations';
import { CreateQuotationsDto } from '@quotations/presenters/dto/create-quotations.dto';

export abstract class CreateQuotationUseCase {
  abstract execute(
    createQuotationsDto: CreateQuotationsDto,
    manager?,
  ): Promise<Quotations>;
}
