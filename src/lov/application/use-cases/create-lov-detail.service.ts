import { CreateListOfValuesDetailDto } from '@lov/presenters/dto/create-lov-detail.dto';
import { Injectable, Logger } from '@nestjs/common';
import { ListOfValuesRepository } from '../ports/outbound/lov.repository';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { ListOfValuesDetail } from '@lov/domain/entities/lov-detail';
import { ListOfValuesDetailRepository } from '../ports/outbound/lov-detail.repository';
import { CreateLovDetailUseCase } from '../ports/inbound/create-lov-detail.use-case';

@Injectable()
export class CreateLovDetailService implements CreateLovDetailUseCase {
  private readonly logger: Logger = new Logger(CreateLovDetailService.name);

  constructor(
    private readonly listOfValuesRepository: ListOfValuesRepository,
    private readonly listOfValuesDetailRepositoryPort: ListOfValuesDetailRepository,
    private readonly userRepositoryPort: UserRepository,
  ) {}

  async execute(
    createListOfValuesDto: CreateListOfValuesDetailDto,
    key: string,
  ) {
    const { createdBy: userCreator } = createListOfValuesDto;

    const [creator, listOfValuesKey] = await Promise.all([
      userCreator && this.userRepositoryPort.findById(userCreator),
      key && this.listOfValuesRepository.findByKey(key),
    ]);

    this.logger.debug(`Creator found: ${JSON.stringify(creator)}`);

    const listOfValuesDetail = new ListOfValuesDetail();
    listOfValuesDetail.key = listOfValuesKey;
    listOfValuesDetail.name = createListOfValuesDto.name;
    listOfValuesDetail.detail = createListOfValuesDto.detail;
    listOfValuesDetail.createdBy = creator;

    const listOfValuesCreated =
      await this.listOfValuesDetailRepositoryPort.save(listOfValuesDetail);

    return this.listOfValuesDetailRepositoryPort.findById(
      listOfValuesCreated.id,
    );
  }
}
