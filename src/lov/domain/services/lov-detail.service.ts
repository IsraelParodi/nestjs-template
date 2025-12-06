import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { IFindOne } from '@common/interfaces/commons.interface';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';

import { UsersDomainService } from '@users/domain/services/users.service';

import { ListOfValuesDetail } from '../lov-detail';
import { ListOfValuesDomainService } from './lov.service';
import { ListOfValuesDetailRepository } from '../repositories/lov-detail.repository';

import { CreateListOfValuesDetailDto } from '@lov/presenters/dto/create-lov-detail.dto';
import { UpdateListOfValuesDetailDto } from '@lov/presenters/dto/update-lov-detail.dto';

@Injectable()
export class ListOfValuesDetailDomainService {
  private readonly logger = new Logger(ListOfValuesDetailDomainService.name);

  constructor(
    private readonly listOfValuesDetailRepository: ListOfValuesDetailRepository,
    private readonly listOfValuesDomainService: ListOfValuesDomainService,
    private readonly usersDomainService: UsersDomainService,
  ) {}

  async create(
    createListOfValuesDto: CreateListOfValuesDetailDto,
    lovKey: string,
  ) {
    const { createdBy: userCreator } = createListOfValuesDto;
    const whereUserCreator = { id: userCreator };

    const [creator, listOfValuesKey] = await Promise.all([
      userCreator &&
        this.usersDomainService.findOne({ where: whereUserCreator }),
      lovKey &&
        this.listOfValuesDomainService.findOne({
          where: { key: lovKey },
        }),
    ]);

    this.logger.debug(`Creator found: ${JSON.stringify(creator)}`);

    const listOfValuesDetail = new ListOfValuesDetail();
    listOfValuesDetail.key = listOfValuesKey;
    listOfValuesDetail.name = createListOfValuesDto.name;
    listOfValuesDetail.detail = createListOfValuesDto.detail;
    listOfValuesDetail.createdBy = creator;

    const listOfValuesCreated =
      await this.listOfValuesDetailRepository.create(listOfValuesDetail);

    return this.findOne({ where: { id: listOfValuesCreated.id } });
  }

  findOne({ where, relations, select }: IFindOne<ListOfValuesDetail>) {
    return this.listOfValuesDetailRepository.findOne({
      where,
      relations,
      select,
    });
  }

  async update(id: number, updateListOfValuesDto: UpdateListOfValuesDetailDto) {
    const listOfValuesDetail = await this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    const { updatedBy: userUpdater } = updateListOfValuesDto;
    const whereUserCreator = { id: userUpdater };

    const updater = await this.usersDomainService.findOne({
      where: whereUserCreator,
    });

    this.logger.debug(`Updater found: ${JSON.stringify(updater)}`);

    Object.assign(listOfValuesDetail, updateListOfValuesDto);
    listOfValuesDetail.updatedBy = updater;

    return this.listOfValuesDetailRepository.update(listOfValuesDetail);
  }

  remove(id: number) {
    return this.listOfValuesDetailRepository.delete(id);
  }
}
