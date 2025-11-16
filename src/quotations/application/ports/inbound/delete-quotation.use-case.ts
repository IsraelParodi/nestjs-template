export abstract class DeleteQuotationUseCase {
  abstract execute(id: number): Promise<void>;
}
