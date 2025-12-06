import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';

import { UsersDomainService } from '@users/domain/services/users.service';

import { ListOfValues } from '../lov';
import { ListOfValuesRepository } from '../repositories/lov.repository';

import { UpdateListOfValuesDto } from '@lov/presenters/dto/update-lov.dto';
import { structuredObject } from '@common/common.utils';

@Injectable()
export class ListOfValuesDomainService {
  private readonly logger = new Logger(ListOfValuesDomainService.name);

  constructor(
    private readonly listOfValuesRepository: ListOfValuesRepository,
    private readonly usersDomainService: UsersDomainService,
  ) {}

  async create(listOfValue: ListOfValues) {
    const { createdBy } = listOfValue;

    const creator = await this.usersDomainService.findOne({
      where: { id: createdBy.id },
    });

    const lov = await this.findOne({ where: { key: listOfValue.key } });

    if (lov) throw new BadRequestException('The LOV already exists');

    const listOfValues = new ListOfValues();
    listOfValues.key = listOfValue.key;
    listOfValues.description = listOfValue.description;
    listOfValues.createdBy = creator;

    const listOfValuesCreated =
      await this.listOfValuesRepository.save(listOfValues);

    return this.findOne({
      where: { id: listOfValuesCreated.id },
      relations: ['createdBy'],
    });
  }

  findAll({ start, limit }: PaginationQueryDto) {
    return this.listOfValuesRepository.find({ start, limit });
  }

  async findOne({
    where,
    relations,
    select,
    validate = false,
  }: IFindOne<ListOfValues>) {
    const lov = await this.listOfValuesRepository.findOne({
      where,
      relations,
      select,
    });

    if (validate && !lov)
      throw new NotFoundException(
        `LOV with ${structuredObject(where)} not found`,
      );

    return lov;
  }

  async update(id: number, updateListOfValuesDto: UpdateListOfValuesDto) {
    const listOfValues = await this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
      validate: true,
    });

    const { updatedBy: userUpdater } = updateListOfValuesDto;

    const updater = await this.usersDomainService.findOne({
      where: { id: userUpdater },
    });

    Object.assign(listOfValues, updateListOfValuesDto);
    listOfValues.updatedBy = updater;

    return this.listOfValuesRepository.update(listOfValues);
  }

  remove(id: number) {
    return this.listOfValuesRepository.delete(id);
  }

  async findChildByKey(key: string, valueId: number) {
    const lov = await this.findLovWithValuesOrThrow(key);

    return this.findLovValueOrThrow(
      lov,
      (value) => value.id === valueId,
      `Don't exist a LOV Detail with id: ${valueId} in LOV with key: ${key}`,
    );
  }

  async findChildByName(key: string, name: string) {
    const lov = await this.findLovWithValuesOrThrow(key);

    return this.findLovValueOrThrow(
      lov,
      (value) => value.name === name,
      `Don't exist a LOV Detail with name: ${name} in LOV with key: ${key}`,
    );
  }

  private async findLovWithValuesOrThrow(key: string): Promise<ListOfValues> {
    const lov = await this.findOne({ where: { key }, relations: ['values'] });

    return lov;
  }

  private findLovValueOrThrow(
    lov: ListOfValues,
    predicate: (value: any) => boolean,
    errorMessage: string,
  ) {
    const valueFound = lov.values?.find(predicate);

    if (!valueFound) {
      this.throwBadRequest(errorMessage);
    }

    return valueFound;
  }

  private throwBadRequest(message: string): never {
    this.logger.debug(message);
    throw new BadRequestException(message);
  }
}
