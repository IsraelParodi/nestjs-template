import { Injectable } from '@nestjs/common';
import { CreateTrackingDto } from '../../presenters/dto/create-tracking.dto';
import { TrackingsDomainService } from '@trackings/domain/services/trackings.service';
import { IFindOne } from '@common/interfaces/commons.interface';
import { Tracking } from '@trackings/domain/tracking';
import { UpdateTrackingDto } from '@trackings/presenters/dto/update-tracking.dto';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryTrackingsDto } from '@trackings/presenters/dto/pagination-query-trackings.dto';

@Injectable()
export class TrackingsApplicationService {
  constructor(private readonly trackingsDomainService: TrackingsDomainService) {}

  async create(createTrackingsDto: CreateTrackingDto) {
    return await this.trackingsDomainService.create(createTrackingsDto);
  }

  findAll(paginationQueryDto: PaginationQueryTrackingsDto) {
    return this.trackingsDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<Tracking>) {
    return this.trackingsDomainService.findOne({
      where,
      relations,
      select,
    });
  }

  update(id: number, updateTrackingsDto: UpdateTrackingDto) {
    return this.trackingsDomainService.update(id, updateTrackingsDto);
  }

  remove(id: number, deletedBy) {
    return this.trackingsDomainService.remove(id, deletedBy);
  }

  removeMany(deleteManyDto: DeleteManyDto, deletedBy: number) {
    return this.trackingsDomainService.removeMany(deleteManyDto, deletedBy);
  }
}
