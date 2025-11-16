import { Quotations } from '@quotations/domain/quotations';
import { UpdateQuotationsDto } from '@quotations/presenters/dto/update-quotations.dto';

export abstract class UpdateQuotationUseCase {
  abstract execute(
    id: number,
    updateQuotationsDto: UpdateQuotationsDto,
  ): Promise<Quotations>;
}
