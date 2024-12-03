import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
// import { PermissionsGuard } from './authorization/guards/permissions.guard';
import { AuthenticationController } from 'src/iam/presenters/http/authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { UserEntity } from 'src/users/infrastructure/persistance/orm/entities/user.entity';
import { AuthenticationApplicationService } from './application/services/authentication.service';
import { AuthenticationDomainService } from './domain/services/authentication.service';
import { AuthenticationGuard } from './infrastructure/guards/authentication.guard';
import { RoleEntity } from './domain/entities/role.entity';
import { Permission } from './domain/entities/permission.entity';
import { Token } from './domain/entities/token.entity';
import { AccessTokenGuard } from './infrastructure/guards/access-token.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { RefreshTokenIdsStorage } from './infrastructure/refresh-token-ids.storage';
import jwtConfig from './infrastructure/config/jwt.config';
import { BcryptService } from './infrastructure/hashing/bcrypt.service';
import { HashingService } from './infrastructure/hashing/hashing.service';
// import { PoliciesGuard } from './authorization/guards/policies.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Token, RoleEntity, Permission]),
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
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: PoliciesGuard,
    // },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationDomainService,
    AuthenticationApplicationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
