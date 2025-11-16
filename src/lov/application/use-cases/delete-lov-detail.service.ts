import { Injectable, Logger } from '@nestjs/common';
import { ListOfValuesDetailRepository } from '../ports/outbound/lov-detail.repository';
import { DeleteLovDetailUseCase } from '../ports/inbound/delete-lov-detail.use-case';

@Injectable()
export class DeleteLovDetailService implements DeleteLovDetailUseCase {
  private readonly logger: Logger = new Logger(DeleteLovDetailService.name);

  constructor(
    private readonly listOfValuesDetailRepositoryPort: ListOfValuesDetailRepository,
  ) {}

  async execute(id: number) {
    return this.listOfValuesDetailRepositoryPort.delete(id);
  }
}
