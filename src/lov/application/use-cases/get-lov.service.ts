import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ListOfValuesRepository } from '../ports/outbound/lov.repository';
import { GetLovUseCase } from '../ports/inbound/get-lov.use-case';

@Injectable()
export class GetLovService implements GetLovUseCase {
  private readonly logger: Logger = new Logger(GetLovService.name);

  constructor(
    private readonly listOfValuesRepositoryPort: ListOfValuesRepository,
  ) {}

  async execute(key: string) {
    const lov = await this.listOfValuesRepositoryPort.findByKey(key);

    if (!lov) throw new NotFoundException(`LOV with key=${key} not found`);

    return lov;
  }
}
