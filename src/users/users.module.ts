import { Module } from '@nestjs/common';
import { UsersApplicationService } from './application/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/persistance/orm/entities/user.entity';
import { UsersController } from './presenters/http/users.controller';
import { UsersDomainService } from './domain/services/users.service';
import { UserRepository } from './domain/repositories/user.repository';
import { OrmUserRepository } from './infrastructure/persistance/orm/repositories/orm-user.repository';
import { HashingService } from 'src/iam/infrastructure/hashing/hashing.service';
import { BcryptService } from 'src/iam/infrastructure/hashing/bcrypt.service';
import { RoleRepository } from 'src/iam/domain/repositories/role.repository';
import { OrmRoleRepository } from 'src/iam/infrastructure/persistance/orm/repositories/orm-role.repository';
import { RoleEntity } from 'src/iam/infrastructure/persistance/orm/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [
    UsersApplicationService,
    UsersDomainService,
    {
      provide: UserRepository,
      useClass: OrmUserRepository,
    },
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: RoleRepository,
      useClass: OrmRoleRepository,
    },
  ],
  exports: [UsersApplicationService, UsersDomainService, UserRepository],
})
export class UsersModule {}
