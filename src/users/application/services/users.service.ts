import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../presenters/dto/create-user.dto';
import { UpdateUserDto } from '../../presenters/dto/update-user.dto';
import { UsersDomainService } from '@users/domain/services/users.service';
import { IFindOne } from '@common/interfaces/commons.interface';
import { User } from '@users/domain/user';
import { NotificationsApplicationService } from '@notifications/application/services/notifications.service';
import { NotificationChannelEnum } from '@notifications/infrastructure/enums/notification-channel.enum';
import { NotificationEmailTemplateEnum } from '@notifications/infrastructure/enums/notification-email-templates.enum';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryUsersDto } from '@users/presenters/dto/pagination-query-users.dto';

@Injectable()
export class UsersApplicationService {
  constructor(
    private readonly usersDomainService: UsersDomainService,
    private readonly notificationsApplicationService: NotificationsApplicationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersDomainService.create(createUserDto);

    await Promise.all([
      this.notificationsApplicationService.send({
        channel: NotificationChannelEnum.EMAIL,
        recipient: user.email,
        subject: 'Melvan - Bienvenido a Melvan',
        templateId: NotificationEmailTemplateEnum.WELCOME,
        message: {
          body: { password: createUserDto.password },
        },
      }),
      this.notificationsApplicationService.send({
        channel: NotificationChannelEnum.EMAIL,
        recipient: user.email,
        subject: 'Melvan - Nuevo usuario registrado',
        templateId: NotificationEmailTemplateEnum.MELVAN_NEW_USER,
        message: {
          body: { email: user.email },
        },
      }),
    ]);

    return user;
  }

  findAll(paginationQueryDto: PaginationQueryUsersDto) {
    return this.usersDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<User>) {
    return this.usersDomainService.findOne({ where, relations, select });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersDomainService.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersDomainService.remove(id);
  }

  removeMany(deleteUserDto: DeleteManyDto, deletedBy: number) {
    return this.usersDomainService.removeMany(deleteUserDto, deletedBy);
  }
}
