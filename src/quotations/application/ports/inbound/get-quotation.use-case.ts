import { Quotations } from '@quotations/domain/quotations';

export abstract class GetQuotationUseCase {
  abstract execute(id: number): Promise<Quotations>;
}
