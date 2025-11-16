import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FeesRepository } from '../repositories/fees.repository';
import { Fee } from '../fee';
import { IFindOne } from '@common/interfaces/commons.interface';
import { CreateFeeDto } from '@fees/presenters/dto/create-fees.dto';
import { UsersDomainService } from '@users/domain/services/users.service';
import { UpdateFeeDto } from '@fees/presenters/dto/update-fees.dto';
import { ListOfValuesDomainService } from '@lov/domain/services/lov.service';
import { SeaPortsDomainService } from '@sea-ports/domain/services/sea-ports.service';
import { CreateContainerDto } from '@fees/presenters/dto/create-containers.dto';
import { CreateExpenseDto } from '@fees/presenters/dto/create-expenses.dto';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PageableService } from '@common/services/pageable.service';
import { PaginationQueryFeesDto } from '@fees/presenters/dto/pagination-query-fees.dto';
import { ILike } from 'typeorm';

@Injectable()
export class FeesDomainService {
  private readonly logger = new Logger(FeesDomainService.name);

  constructor(
    private readonly feesRepository: FeesRepository,
    private readonly usersDomainService: UsersDomainService,
    private readonly listOfValuesDomainService: ListOfValuesDomainService,
    private readonly seaPortsDomainService: SeaPortsDomainService,
    private readonly pageableService: PageableService,
  ) {}

  async create(createFeesDto: CreateFeeDto) {
    const { executor } = await this.feesValidations(createFeesDto, true);

    await Promise.all([
      this.nestedFeesValidations(createFeesDto.containers, 'containers_size', 'size'),
      this.nestedFeesValidations(createFeesDto.expenses, 'unit_of_measurement', 'unit'),
    ]);

    const fees = Object.assign(new Fee(), createFeesDto, { createdBy: executor });

    const feesSaved = await this.feesRepository.save(fees);

    return feesSaved;
  }

  async findAll({ start, limit, ...filters }: PaginationQueryFeesDto) {
    const where: any = {};
    const { sortBy = 'id', order = 'ASC' } = filters;

    if (filters.name) where.name = ILike(`%${filters.name}%`);

    const { data: fees = [], total } = await this.feesRepository.find({
      start,
      limit,
      where,
      order: { [sortBy]: order },
      relations: ['containers', 'expenses', 'createdBy', 'updatedBy'],
    });

    if (fees.length === 0) return [];

    const portKeys = new Set<string>();

    fees.forEach(({ origin, destination }) => {
      portKeys.add(`${origin.slice(0, 2)}-${origin.slice(-3)}`);
      portKeys.add(`${destination.slice(0, 2)}-${destination.slice(-3)}`);
    });

    const ports = await Promise.all(
      [...portKeys].map(async (key) => {
        const [iso2Country, location] = key.split('-');
        const data = await this.seaPortsDomainService.findOne({ where: { iso2Country, location } });
        return { key, data };
      }),
    );

    const portMap = new Map(ports.map(({ key, data }) => [key, data]));

    const feesMapped = fees.map((fee) => {
      const [oIso, oLoc] = [fee.origin.slice(0, 2), fee.origin.slice(-3)];
      const [dIso, dLoc] = [fee.destination.slice(0, 2), fee.destination.slice(-3)];

      const origin = portMap.get(`${oIso}-${oLoc}`);
      const destination = portMap.get(`${dIso}-${dLoc}`);

      return {
        ...fee,
        originName: origin?.name,
        destinationName: destination?.name,
        originCountry: origin?.country,
        destinationCountry: destination?.country,
      };
    });

    return this.pageableService.getPages({ data: feesMapped, total, start, limit });
  }

  async findOne({ where, relations, select }: IFindOne<Fee>) {
    const fee = await this.feesRepository.findOne({
      where,
      relations: ['containers', 'expenses', 'createdBy', 'updatedBy'],
      select,
    });

    const originIso2 = fee.origin.substring(0, 2);
    const originLocation = fee.origin.slice(-3);
    const destinationIso2 = fee.destination.substring(0, 2);
    const destinationLocation = fee.destination.slice(-3);

    const [origin, destination] = await Promise.all([
      this.seaPortsDomainService.findOne({
        where: { iso2Country: originIso2, location: originLocation },
      }),
      this.seaPortsDomainService.findOne({
        where: { iso2Country: destinationIso2, location: destinationLocation },
      }),
    ]);

    fee.originEntity = origin;
    fee.destinationEntity = destination;

    return fee;
  }

  async update(id: number, updateFeesDto: UpdateFeeDto) {
    const fees = await this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'containers', 'expenses'],
    });

    const { executor } = await this.feesValidations(updateFeesDto, false);

    await Promise.all([
      this.nestedFeesValidations(updateFeesDto.containers, 'containers_size', 'size'),
      this.nestedFeesValidations(updateFeesDto.expenses, 'unit_of_measurement', 'unit'),
    ]);

    Object.assign(fees, updateFeesDto, { updatedBy: executor });

    return this.feesRepository.update(fees);
  }

  remove(id: number) {
    return this.feesRepository.delete(id);
  }

  removeMany(deleteManyDto: DeleteManyDto, deletedBy: number) {
    return this.feesRepository.deleteMany(deleteManyDto, deletedBy);
  }

  async feesValidations(dto: CreateFeeDto | UpdateFeeDto, isCreate: boolean) {
    const { createdBy, currency, customsOffice, shipmentType, origin, destination } = dto;
    const updatedBy = 'updatedBy' in dto ? dto.updatedBy : undefined;
    const userId = isCreate ? createdBy : updatedBy;

    const queries = [
      userId ? this.usersDomainService.findOne({ where: { id: userId } }) : Promise.resolve(null),
      origin
        ? this.seaPortsDomainService.findOne({
            where: {
              iso2Country: origin.substring(0, 2),
              location: origin.slice(-3),
            },
          })
        : Promise.resolve(null),
      destination
        ? this.seaPortsDomainService.findOne({
            where: {
              iso2Country: destination.substring(0, 2),
              location: destination.slice(-3),
            },
          })
        : Promise.resolve(null),
      customsOffice
        ? this.listOfValuesDomainService.findChildByName('customs_office', customsOffice)
        : Promise.resolve(null),
      shipmentType
        ? this.listOfValuesDomainService.findChildByName('shipping_type', shipmentType)
        : Promise.resolve(null),
      currency ? this.listOfValuesDomainService.findChildByName('currency', currency) : Promise.resolve(null),
    ];

    const [executor] = await Promise.all(queries);

    if (!executor && !isCreate) {
      const errorMessage = `No existe usuario con id: ${userId}`;
      this.logger.debug(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    return { executor, origin, destination };
  }

  async nestedFeesValidations(dto: CreateContainerDto[] | CreateExpenseDto[], lovName: string, keyName: string) {
    const queries = [];
    dto.forEach((entity) => {
      queries.push(
        entity[keyName]
          ? this.listOfValuesDomainService.findChildByName(lovName, entity[keyName])
          : Promise.resolve(null),
      );
    });

    const containerSizeFound = await Promise.all(queries);

    return {
      containerSizeFound,
    };
  }
}
