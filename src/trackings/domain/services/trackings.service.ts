import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TrackingsRepository } from '../repositories/trackings.repository';
import { Tracking } from '../tracking';
import { IFindOne } from '@common/interfaces/commons.interface';
import { CreateTrackingDto } from '@trackings/presenters/dto/create-tracking.dto';
import { UsersDomainService } from '@users/domain/services/users.service';
import { UpdateTrackingDto } from '@trackings/presenters/dto/update-tracking.dto';
import { ListOfValuesDomainService } from '@lov/domain/services/lov.service';
import { SeaPortsDomainService } from '@sea-ports/domain/services/sea-ports.service';
import { ROLES_DB } from '@users/infrastructure/enums/role.enum';
import { Role } from '@users/domain/role';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryTrackingsDto } from '@trackings/presenters/dto/pagination-query-trackings.dto';
import { ILike } from 'typeorm';
import { SendNotificationType } from '@notifications/infrastructure/types/send-notification.type';
import { NotificationChannelEnum } from '@notifications/infrastructure/enums/notification-channel.enum';
import { NotificationEmailTemplateEnum } from '@notifications/infrastructure/enums/notification-email-templates.enum';
import { NotificationsDomainService } from '@notifications/domain/services/notifications.service';
import { BO_URL } from '@common/common.constants';

@Injectable()
export class TrackingsDomainService {
  private readonly logger = new Logger(TrackingsDomainService.name);

  constructor(
    private readonly trackingsRepository: TrackingsRepository,
    private readonly usersDomainService: UsersDomainService,
    private readonly listOfValuesDomainService: ListOfValuesDomainService,
    private readonly seaPortsDomainService: SeaPortsDomainService,
    private readonly notificationService: NotificationsDomainService,
  ) {}

  async create(createTrackingsDto: CreateTrackingDto) {
    const { executor, notifierFound } = await this.trackingsValidations(createTrackingsDto, true);

    await this.validateUniqueFields(createTrackingsDto);

    const trackings = Object.assign(new Tracking(), createTrackingsDto, { createdBy: executor });

    const trackingsSaved = await this.trackingsRepository.save(trackings);

    const paramsNotificationEmailSend: SendNotificationType = {
      channel: NotificationChannelEnum.EMAIL,
      recipient: notifierFound.email,
      subject: 'Melvan - Resumen de pedido',
      templateId: NotificationEmailTemplateEnum.USER_TRACKING_NOTIFICATION,
      message: {
        body: {
          customsOffice: trackingsSaved.customsOffice,
          shipper: trackingsSaved.shipper,
          origin: trackingsSaved.origin,
          destination: trackingsSaved.destination,
          eta: trackingsSaved.eta.toString(),
          etd: trackingsSaved.etd.toString(),
          backofficeUrl: BO_URL()[process.env.NODE_ENV],
        },
      },
    };

    await this.notificationService.send(paramsNotificationEmailSend);

    return trackingsSaved;
  }

  findAll({ start, limit, ...filters }: PaginationQueryTrackingsDto) {
    const where: any = {};

    if (filters.routing) where.routing = ILike(`%${filters.routing}%`);

    if (filters.userId) where.userId = filters.userId;

    return this.trackingsRepository.find({
      start,
      limit,
      where,
      relations: [
        'containers',
        'seals',
        'consignee',
        'notifier',
        'containers.createdBy',
        'seals.createdBy',
        'createdBy',
        'updatedBy',
      ],
    });
  }

  async findOne({ where, relations, select }: IFindOne<Tracking>, validate = true) {
    const tracking = await this.trackingsRepository.findOne({
      where,
      relations: [
        'containers',
        'seals',
        'consignee',
        'notifier',
        'containers.createdBy',
        'seals.createdBy',
        'createdBy',
        'updatedBy',
      ],
      select,
    });

    if (!tracking.id && validate) {
      throw new BadRequestException(`Tracking with ID ${where.id} does not exists`);
    }

    return tracking;
  }

  async update(id: number, updateTrackingsDto: UpdateTrackingDto) {
    const trackings = await this.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'containers', 'expenses'],
    });

    const { executor } = await this.trackingsValidations(updateTrackingsDto, false);

    Object.assign(trackings, updateTrackingsDto, { updatedBy: executor });

    return this.trackingsRepository.update(trackings);
  }

  remove(id: number, deletedBy) {
    return this.trackingsRepository.delete(id, deletedBy);
  }

  removeMany(deleteManyDto: DeleteManyDto, deletedBy: number) {
    return this.trackingsRepository.deleteMany(deleteManyDto, deletedBy);
  }

  async trackingsValidations(dto: CreateTrackingDto | UpdateTrackingDto, isCreate: boolean) {
    const { createdBy, consignee, customsOffice, notifier, origin, destination, regime, blAuthorization } = dto;

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
      blAuthorization
        ? this.listOfValuesDomainService.findChildByName('bl_authorization', blAuthorization)
        : Promise.resolve(null),
      regime ? this.listOfValuesDomainService.findChildByName('regime', regime) : Promise.resolve(null),
      notifier
        ? this.usersDomainService.findOne({ where: { id: notifier, role: new Role(ROLES_DB.customer) } })
        : Promise.resolve(null),
      consignee
        ? this.usersDomainService.findOne({ where: { id: consignee, role: new Role(ROLES_DB.customer) } })
        : Promise.resolve(null),
    ];

    const [executor, _1, _2, _3, _4, _5, notifierFound] = await Promise.all(queries);

    if (!executor && !isCreate) {
      const errorMessage = `No existe usuario con id: ${userId}`;
      this.logger.debug(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    return { executor, notifierFound };
  }

  private async validateUniqueFields(createTrackingsDto: CreateTrackingDto) {
    const uniqueFields = ['routing', 'mbl_mawb', 'hbl_mawb'];

    for (const field of uniqueFields) {
      const existingRecord = await this.findOne({ where: { [field]: createTrackingsDto[field] } }, false);

      if (existingRecord?.id) {
        throw new BadRequestException(`Tracking with ${field} ${createTrackingsDto[field]} already exists`);
      }
    }
  }
}
