export abstract class UnitOfWorkPort<Tx = unknown> {
  abstract execute<T>(work: (tx: Tx) => Promise<T>): Promise<T>;
}
