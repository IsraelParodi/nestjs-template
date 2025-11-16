export abstract class DeleteContactUsUseCase {
  abstract execute(id: number, deletedBy: number): Promise<void>;
}
