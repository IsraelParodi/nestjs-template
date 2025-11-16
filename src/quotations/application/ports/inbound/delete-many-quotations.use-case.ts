export abstract class DeleteManyQuotationsUseCase {
  abstract execute(ids: number[], deletedBy: number): Promise<void>;
}
