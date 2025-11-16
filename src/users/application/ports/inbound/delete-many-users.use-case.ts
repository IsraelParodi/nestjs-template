export abstract class DeleteManyUsersUseCase {
  abstract execute(ids: number[], deletedBy: number): Promise<void>;
}
