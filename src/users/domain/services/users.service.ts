import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '@users/presenters/dto/create-user.dto';
import { UpdateUserDto } from '@users/presenters/dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../user';
import { Role } from '../role';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';
import { RolesDomainService } from '@iam/domain/services/roles.service';
import { IFindOne } from '@common/interfaces/commons.interface';
import { CountriesDomainService } from '@localities/domain/services/countries.service';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { ILike } from 'typeorm';
import { PaginationQueryUsersDto } from '@users/presenters/dto/pagination-query-users.dto';
import { NotificationChannelEnum } from '@notifications/infrastructure/enums/notification-channel.enum';
import { NotificationEmailTemplateEnum } from '@notifications/infrastructure/enums/notification-email-templates.enum';
import { SendNotificationType } from '@notifications/infrastructure/types/send-notification.type';
import { NotificationsDomainService } from '@notifications/domain/services/notifications.service';

@Injectable()
export class UsersDomainService {
  private readonly logger = new Logger(UsersDomainService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RolesDomainService,
    private readonly hashingService: HashingService,
    private readonly countriesDomainService: CountriesDomainService,
    private readonly notificationService: NotificationsDomainService,
  ) {}

  async create(createUserDto: Partial<CreateUserDto>) {
    try {
      const [roleFound, creator, country] = await Promise.all([
        createUserDto.role &&
          this.roleService.findOne({ where: { id: createUserDto.role } }),
        createUserDto.createdBy &&
          this.userRepository.findOne({
            where: { id: createUserDto.createdBy },
          }),
        createUserDto.country &&
          this.countriesDomainService.findOne({
            where: { id: createUserDto.country },
          }),
      ]);

      this.logger.debug(`Role found: ${JSON.stringify(roleFound)}`);
      this.logger.debug(`Country found: ${JSON.stringify(country)}`);

      const user = new User();
      Object.assign(user, createUserDto);
      user.password = await this.hashingService.hash(createUserDto.password);
      user.role =
        (roleFound ?? process.env.APP_ENV === 'TEST')
          ? new Role(1)
          : new Role(2);
      user.country = country;

      if (createUserDto.createdBy) {
        user.createdBy = creator;
      }

      const result = await this.userRepository.create(user);

      return this.userRepository.findOne({
        where: { id: result.id },
        relations: ['createdBy', 'updatedBy'],
        select: {
          id: true,
          email: true,
          updatedAt: true,
          createdAt: true,
          deletedAt: true,
          phone: true,
        },
      });
    } catch (error) {
      let errorException;
      const pgUniqueViolationErrorCode = '23505';
      if (error.code === pgUniqueViolationErrorCode) {
        errorException = new ConflictException();
      }
      throw errorException;
    }
  }

  findAll({ start, limit, ...filters }: PaginationQueryUsersDto) {
    const where: any = {};

    if (filters.name) where.name = ILike(`%${filters.name}%`);
    if (filters.lastname) where.lastname = ILike(`%${filters.lastname}%`);
    if (filters.role) where.role = new Role(Number(filters.role));

    return this.userRepository.find({
      start,
      limit,
      where,
      select: {
        id: true,
        address: true,
        businessTaxId: true,
        email: true,
        lastname: true,
        legalName: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  findOne({ where, relations, select }: IFindOne<User>) {
    return this.userRepository.findOne({ where, relations, select });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let country;
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'deletedBy'],
    });

    country = user.country;

    if (updateUserDto.country) {
      country = await this.countriesDomainService.findOne({
        where: { id: updateUserDto.country },
      });
    }

    const [roleFound, updater] = await Promise.all([
      updateUserDto.role &&
        this.roleService.findOne({ where: { id: updateUserDto.role } }),
      updateUserDto.updatedBy &&
        this.userRepository.findOne({
          where: { id: updateUserDto.updatedBy },
        }),
    ]);

    this.logger.debug(`Role found: ${JSON.stringify(roleFound)}`);

    Object.assign(user, updateUserDto);
    user.updatedBy = updater;
    user.role = roleFound;
    user.country = country;

    if (updateUserDto.password) {
      user.password = await this.hashingService.hash(updateUserDto.password);
    }

    const shouldSendAccessChangeEmail =
      updateUserDto.email || updateUserDto.password;

    if (shouldSendAccessChangeEmail) {
      const paramsNotificationEmailSend: SendNotificationType = {
        channel: NotificationChannelEnum.EMAIL,
        recipient: user.email,
        subject: 'Melvan - Datos de acceso actualizados',
        templateId: NotificationEmailTemplateEnum.USER_ACCESS_CHANGE,
        message: { body: {} },
      };

      await this.notificationService.send(paramsNotificationEmailSend);
    }
    await this.userRepository.update({ ...user });

    return this.userRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
      select: {
        id: true,
        email: true,
        updatedAt: true,
        createdAt: true,
        deletedAt: true,
      },
    });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  removeMany(deleteUserDto: DeleteManyDto, deletedBy: number) {
    return this.userRepository.deleteMany(deleteUserDto, deletedBy);
  }
}
