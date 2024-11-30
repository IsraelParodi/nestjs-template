import { Module } from '@nestjs/common';
import { HashingService } from '../infrastructure/hashing/hashing.service';
import { BcryptService } from '../infrastructure/hashing/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../infrastructure/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../infrastructure/guards/access-token.guard';
import { Token } from '../domain/entities/token.entity';
import { RefreshTokenIdsStorage } from '../infrastructure/refresh-token-ids.storage';
import { RolesGuard } from '../infrastructure/guards/roles.guard';
// import { PermissionsGuard } from './authorization/guards/permissions.guard';
import { Permission } from '../domain/entities/permission.entity';
import { Role } from '../domain/entities/role.entity';
import { AuthenticationController } from 'src/iam/presenters/http/authentication.controller';
import { AuthenticationService } from 'src/iam/application/services/authentication.service';
import { AuthenticationGuard } from '../infrastructure/guards/authentication.guard';
// import { PoliciesGuard } from './authorization/guards/policies.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Role, Permission]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
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
    AuthenticationService,
    RefreshTokenIdsStorage,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
