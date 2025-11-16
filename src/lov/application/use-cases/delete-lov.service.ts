import { Injectable, Logger } from '@nestjs/common';
import { ListOfValuesRepository } from '../ports/outbound/lov.repository';
import { DeleteLovUseCase } from '../ports/inbound/delete-lov.use-case';

@Injectable()
export class DeleteLovService implements DeleteLovUseCase {
  private readonly logger: Logger = new Logger(DeleteLovService.name);

  constructor(
    private readonly listOfValuesRepositoryPort: ListOfValuesRepository,
  ) {}

  async execute(id: number) {
    return this.listOfValuesRepositoryPort.delete(id);
  }
}
