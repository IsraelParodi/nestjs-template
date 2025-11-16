// common/domain/domain.exception.ts
export abstract class DomainException extends Error {
  abstract readonly code: string;
  readonly statusCode: number;

  protected constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
