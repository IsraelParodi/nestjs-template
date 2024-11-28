import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationController } from '@iam/presenters/http/authentication.controller';
import { UsersModule } from '@users/users.module';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';
import { AuthenticationApplicationService } from './application/services/authentication.service';
import { AuthenticationDomainService } from './domain/services/authentication.service';
import { AuthenticationGuard } from './infrastructure/guards/authentication.guard';
import { AccessTokenGuard } from './infrastructure/guards/access-token.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { RefreshTokenIdsStorage } from './infrastructure/refresh-token-ids.storage';
import jwtConfig from './infrastructure/config/jwt.config';
import { BcryptService } from './infrastructure/hashing/bcrypt.service';
import { HashingService } from './infrastructure/hashing/hashing.service';
import { TokenEntity } from './infrastructure/persistance/orm/entities/token.entity';
import { RoleEntity } from './infrastructure/persistance/orm/entities/role.entity';
import { PermissionEntity } from './infrastructure/persistance/orm/entities/permission.entity';
import { TokenRepository } from './domain/repositories/token.repository';
import { OrmTokenRepository } from './infrastructure/persistance/orm/repositories/orm-token.repository';
import { RolesController } from './presenters/http/roles.controller';
import { RolesApplicationService } from './application/services/roles.service';
import { RolesDomainService } from './domain/services/roles.service';
import { RoleRepository } from './domain/repositories/role.repository';
import { OrmRoleRepository } from './infrastructure/persistance/orm/repositories/orm-role.repository';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TokenEntity,
      PermissionEntity,
      RoleEntity,
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    UsersModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationDomainService,
    AuthenticationApplicationService,
    {
      provide: TokenRepository,
      useClass: OrmTokenRepository,
    },
    RolesApplicationService,
    RolesDomainService,
    {
      provide: RoleRepository,
      useClass: OrmRoleRepository,
    },
  ],
  controllers: [AuthenticationController, RolesController],
})
export class IamModule {}
