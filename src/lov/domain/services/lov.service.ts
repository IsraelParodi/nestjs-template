import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';

import { UsersDomainService } from '@users/domain/services/users.service';

import { ListOfValues } from '../lov';
import { ListOfValuesRepository } from '../repositories/lov.repository';

import { CreateListOfValuesDto } from '@lov/presenters/dto/create-lov.dto';
import { UpdateListOfValuesDto } from '@lov/presenters/dto/update-lov.dto';

@Injectable()
export class ListOfValuesDomainService {
  private readonly logger = new Logger(ListOfValuesDomainService.name);

  constructor(
    private readonly listOfValuesRepository: ListOfValuesRepository,
    private readonly usersDomainService: UsersDomainService,
  ) {}

  async create(createListOfValuesDto: CreateListOfValuesDto) {
    const { createdBy: userCreator } = createListOfValuesDto;
    const whereUserCreator = { id: userCreator };

    const [creator] = await Promise.all([userCreator && this.usersDomainService.findOne({ where: whereUserCreator })]);

    //Valida si el usuario existe
    if (userCreator && !creator) {
      const errorMessage = `No existe admin con id: ${userCreator}`;
      this.logger.debug(errorMessage);

      throw new BadRequestException(errorMessage);
    }

    this.logger.debug(`Creator found: ${JSON.stringify(creator)}`);

    const listOfValues = new ListOfValues();
    listOfValues.key = createListOfValuesDto.key;
    listOfValues.description = createListOfValuesDto.description;
    listOfValues.createdBy = creator;

    const listOfValuesCreated = await this.listOfValuesRepository.save(listOfValues);

    return this.findOne({
      where: { id: listOfValuesCreated.id },
      relations: ['createdBy'],
    });
  }

  findAll({ start, limit }: PaginationQueryDto) {
    return this.listOfValuesRepository.find({ start, limit });
  }

  findOne({ where, relations, select }: IFindOne<ListOfValues>) {
    return this.listOfValuesRepository.findOne({ where, relations, select });
  }

  async update(id: number, updateListOfValuesDto: UpdateListOfValuesDto) {
    const listOfValues = await this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    const { updatedBy: userUpdater } = updateListOfValuesDto;
    const whereUserCreator = { id: userUpdater };

    const [updater] = await Promise.all([userUpdater && this.usersDomainService.findOne({ where: whereUserCreator })]);

    //Valida si el usuario existe
    if (userUpdater && !updater) {
      const errorMessage = `No existe usuario con id: ${userUpdater}`;
      this.logger.debug(errorMessage);

      throw new BadRequestException(errorMessage);
    }

    this.logger.debug(`Updater found: ${JSON.stringify(updater)}`);

    Object.assign(listOfValues, updateListOfValuesDto);
    listOfValues.updatedBy = updater;

    return this.listOfValuesRepository.update(listOfValues);
  }

  remove(id: number) {
    return this.listOfValuesRepository.delete(id);
  }

  async findChildByKey(key: string, valueId: number) {
    const lov = await this.findOne({ where: { key }, relations: ['values'] });

    if (!lov) {
      const errorMessage = `Don't exist a LOV with key: ${key}`;
      throw new BadRequestException(errorMessage);
    }

    const valueFound = lov.values?.find((value) => value.id === valueId);

    if (!valueFound) {
      const errorMessage = `Don't exist a LOV Detail with id: ${valueId} in LOV with key: ${key}`;
      throw new BadRequestException(errorMessage);
    }

    return valueFound;
  }

  async findChildByName(key: string, name: string) {
    const lov = await this.findOne({ where: { key }, relations: ['values'] });

    if (!lov) {
      const errorMessage = `Don't exist a LOV with key: ${key}`;
      throw new BadRequestException(errorMessage);
    }

    const valueFound = lov.values?.find((value) => value.name === name);

    if (!valueFound) {
      const errorMessage = `Don't exist a LOV Detail with name: ${name} in LOV with key: ${key}`;
      throw new BadRequestException(errorMessage);
    }

    return valueFound;
  }
}
