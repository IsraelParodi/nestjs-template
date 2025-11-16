import { Injectable, Logger } from '@nestjs/common';
import { ListOfValuesRepository } from '../ports/outbound/lov.repository';
import { UpdateListOfValuesDto } from '@lov/presenters/dto/update-lov.dto';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { UpdateLovUseCase } from '../ports/inbound/update-lov.use-case';

@Injectable()
export class UpdateLovService implements UpdateLovUseCase {
  private readonly logger: Logger = new Logger(UpdateLovService.name);

  constructor(
    private readonly listOfValuesRepositoryPort: ListOfValuesRepository,
    private readonly userRepositoryPort: UserRepository,
  ) {}

  async execute(id: number, updateListOfValuesDto: UpdateListOfValuesDto) {
    const listOfValues = await this.listOfValuesRepositoryPort.findById(id);

    const { updatedBy: userUpdater } = updateListOfValuesDto;

    const updater = await this.userRepositoryPort.findById(userUpdater);

    Object.assign(listOfValues, updateListOfValuesDto);
    listOfValues.updatedBy = updater;

    return this.listOfValuesRepositoryPort.save(listOfValues);
  }
}
