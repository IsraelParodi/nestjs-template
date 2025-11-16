export abstract class DeleteManyContactUsUseCase {
  abstract execute(ids: number[], deletedBy?: number): Promise<void>;
}
