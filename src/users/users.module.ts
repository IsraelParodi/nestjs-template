import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/adapters/typeorm/entities/user.entity';
import { UsersController } from './presentation/http/users.controller';
import { UserRepository } from './application/ports/outbound/user.repository';
import { BcryptService } from '@iam/infrastructure/hashing/bcrypt.service';
import { TypeOrmRoleRepository } from '@iam/infrastructure/adapters/typeorm/repositories/typeorm-role.repository';
import { RoleEntity } from '@iam/infrastructure/adapters/typeorm/entities/role.entity';
import { NotificationsModule } from '@notifications/notifications.module';
import { LocalitiesModule } from '@localities/localities.module';
import { CreateUserService } from './application/use-cases/create-user.service';
import { GetUserService } from './application/use-cases/get-user.service';
import { ListUsersService } from './application/use-cases/list-users.service';
import { UpdateUserService } from './application/use-cases/update-user.service';
import { DeleteUserService } from './application/use-cases/delete-user.service';
import { DeleteManyUsersService } from './application/use-cases/delete-many-users.service';
import { RoleRepository } from '@iam/application/ports/outbound/role.repository';
import { CreateUserUseCase } from './application/ports/inbound/create-user.use-case';
import { GetUserUseCase } from './application/ports/inbound/get-user.use-case';
import { ListUsersUseCase } from './application/ports/inbound/list-users.use-case';
import { UpdateUserUseCase } from './application/ports/inbound/update-user.use-case';
import { DeleteUserUseCase } from './application/ports/inbound/delete-user.use-case';
import { DeleteManyUsersUseCase } from './application/ports/inbound/delete-many-users.use-case';
import { TypeOrmUserRepository } from './infrastructure/adapters/typeorm/repositories/typeorm-user.repository';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, UserEntity]),
    NotificationsModule,
    LocalitiesModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: CreateUserUseCase,
      useClass: CreateUserService,
    },
    {
      provide: GetUserUseCase,
      useClass: GetUserService,
    },
    {
      provide: ListUsersUseCase,
      useClass: ListUsersService,
    },
    {
      provide: UpdateUserUseCase,
      useClass: UpdateUserService,
    },
    {
      provide: DeleteUserUseCase,
      useClass: DeleteUserService,
    },
    {
      provide: DeleteManyUsersUseCase,
      useClass: DeleteManyUsersService,
    },
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: RoleRepository,
      useClass: TypeOrmRoleRepository,
    },
  ],
  exports: [
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    DeleteManyUsersUseCase,
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
  ],
})
export class UsersModule {}
