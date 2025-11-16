export abstract class DeleteComplainUseCase {
  abstract execute(id: number): Promise<void>;
}
