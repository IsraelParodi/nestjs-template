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

    const creator = await this.findUserOrThrow(
      userCreator,
      `No existe admin con id: ${userCreator}`,
      'Creator',
    );

    const listOfValues = new ListOfValues();
    listOfValues.key = createListOfValuesDto.key;
    listOfValues.description = createListOfValuesDto.description;
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

  findOne({ where, relations, select }: IFindOne<ListOfValues>) {
    return this.listOfValuesRepository.findOne({ where, relations, select });
  }

  async update(id: number, updateListOfValuesDto: UpdateListOfValuesDto) {
    const listOfValues = await this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    const { updatedBy: userUpdater } = updateListOfValuesDto;

    const updater = await this.findUserOrThrow(
      userUpdater,
      `No existe usuario con id: ${userUpdater}`,
      'Updater',
    );

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

  // ---------- private helpers ----------

  private async findUserOrThrow(
    userId: number | undefined,
    notFoundMessage: string,
    debugLabel: string,
  ) {
    if (!userId) {
      return undefined;
    }

    const user = await this.usersDomainService.findOne({
      where: { id: userId },
    });

    if (!user) {
      this.throwBadRequest(notFoundMessage);
    }

    this.logger.debug(`${debugLabel} found: ${JSON.stringify(user)}`);

    return user;
  }

  private async findLovWithValuesOrThrow(key: string): Promise<ListOfValues> {
    const lov = await this.findOne({ where: { key }, relations: ['values'] });

    if (!lov) {
      this.throwBadRequest(`Don't exist a LOV with key: ${key}`);
    }

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
