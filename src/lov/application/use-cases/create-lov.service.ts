import { CreateListOfValuesDto } from '@lov/presenters/dto/create-lov.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ListOfValuesRepository } from '../ports/outbound/lov.repository';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { ListOfValues } from '@lov/domain/entities/lov';
import { CreateLovUseCase } from '../ports/inbound/create-lov.use-case';

@Injectable()
export class CreateLovService implements CreateLovUseCase {
  private readonly logger: Logger = new Logger(CreateLovService.name);

  constructor(
    private readonly listOfValuesRepository: ListOfValuesRepository,
    private readonly userRepositoryPort: UserRepository,
  ) {}

  async execute(createListOfValuesDto: CreateListOfValuesDto) {
    const { createdBy } = createListOfValuesDto;

    const creator = await this.userRepositoryPort.findById(createdBy);

    if (!creator) throw new BadRequestException('The User does not exists');

    const lov = await this.listOfValuesRepository.findByKey(
      createListOfValuesDto.key,
    );

    if (lov) throw new BadRequestException('The LOV already exists');

    const listOfValues = new ListOfValues();
    listOfValues.key = createListOfValuesDto.key;
    listOfValues.description = createListOfValuesDto.description;
    listOfValues.createdBy = creator;

    const listOfValuesCreated =
      await this.listOfValuesRepository.save(listOfValues);

    return this.listOfValuesRepository.findById(listOfValuesCreated.id);
  }
}
