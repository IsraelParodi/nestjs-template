import { Injectable, Logger } from '@nestjs/common';
import { ListOfValuesDetailRepository } from '../ports/outbound/lov-detail.repository';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { UpdateListOfValuesDetailDto } from '../../presenters/dto/update-lov-detail.dto';
import { UpdateLovDetailUseCase } from '../ports/inbound/update-lov-detail.use-case';

@Injectable()
export class UpdateLovDetailService implements UpdateLovDetailUseCase {
  private readonly logger: Logger = new Logger(UpdateLovDetailService.name);

  constructor(
    private readonly listOfValuesDetailRepositoryPort: ListOfValuesDetailRepository,
    private readonly userRepositoryPort: UserRepository,
  ) {}

  async execute(
    id: number,
    updateListOfValuesDetailDto: UpdateListOfValuesDetailDto,
  ) {
    const listOfValuesDetail =
      await this.listOfValuesDetailRepositoryPort.findById(id);

    const { updatedBy } = updateListOfValuesDetailDto;

    const updater = await this.userRepositoryPort.findById(updatedBy);

    this.logger.debug(`Updater found: ${JSON.stringify(updater)}`);

    Object.assign(listOfValuesDetail, updateListOfValuesDetailDto);
    listOfValuesDetail.updatedBy = updater;

    return this.listOfValuesDetailRepositoryPort.save(listOfValuesDetail);
  }
}
