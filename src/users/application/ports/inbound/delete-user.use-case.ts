export abstract class DeleteUserUseCase {
  abstract execute(id: number, deletedBy: number): Promise<void>;
}
