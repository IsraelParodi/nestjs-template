import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationController } from '@iam/presenters/http/authentication.controller';
import { UsersModule } from '@users/users.module';
import { UserEntity } from '@users/infrastructure/adapters/typeorm/entities/user.entity';
import { AuthenticationGuard } from './infrastructure/guards/authentication.guard';
import { AccessTokenGuard } from './infrastructure/guards/access-token.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { RefreshTokenIdsStorage } from './infrastructure/refresh-token-ids.storage';
import jwtConfig from './infrastructure/config/jwt.config';
import { BcryptService } from './infrastructure/hashing/bcrypt.service';
import { HashingService } from './infrastructure/hashing/hashing.service';
import { TokenEntity } from './infrastructure/adapters/typeorm/entities/token.entity';
import { RoleEntity } from './infrastructure/adapters/typeorm/entities/role.entity';
import { PermissionEntity } from './infrastructure/adapters/typeorm/entities/permission.entity';
import { TypeOrmTokenRepository } from './infrastructure/adapters/typeorm/repositories/typeorm-token.repository';
import { RolesController } from './presenters/http/roles.controller';
import { TypeOrmRoleRepository } from './infrastructure/adapters/typeorm/repositories/typeorm-role.repository';
import { ThrottlerGuard } from '@nestjs/throttler';
import { NotificationsModule } from '@notifications/notifications.module';
import { ResetPasswordEntity } from './infrastructure/adapters/typeorm/entities/reset-password.entity';
import { TypeOrmResetPasswordRepository } from './infrastructure/adapters/typeorm/repositories/typeorm-reset-password.repository';
import { AuthenticationService } from './application/services/authentication.service';
import { TokenRepository } from './application/ports/outbound/token.repository';
import { RoleRepository } from './application/ports/outbound/role.repository';
import { ResetPasswordRepository } from './application/ports/outbound/reset-password.repository';
import { SignUpService } from './application/use-cases/authentication/sign-up.service';
import { SignUpUseCase } from './application/ports/inbound/authentication/sign-up.use-case';
import { SignInService } from './application/use-cases/authentication/sign-in.service';
import { SignInUseCase } from './application/ports/inbound/authentication/sign-in.use-case';
import { RefreshTokenService } from './application/use-cases/authentication/refresh-token.service';
import { RefreshTokenUseCase } from './application/ports/inbound/authentication/refresh-token.use-case';
import { ForgotPasswordUseCase } from './application/ports/inbound/authentication/forgot-password.use-case';
import { ForgotPasswordService } from './application/use-cases/authentication/forgot-password.service';
import { ResetPasswordUseCase } from './application/ports/inbound/authentication/reset-password.use-case';
import { ResetPasswordService } from './application/use-cases/authentication/reset-password.service';
import { CreateRoleService } from './application/use-cases/roles/create-role.use-case';
import { CreateRoleUseCase } from './application/ports/inbound/roles/create-role.use-case';
import { DeleteRoleService } from './application/use-cases/roles/delete-role.use-case';
import { GetRoleUseCase } from './application/ports/inbound/roles/get-role.use-case';
import { DeleteRoleUseCase } from './application/ports/inbound/roles/delete-role.use-case';
import { GetRoleService } from './application/use-cases/roles/get-role.use-case';
import { ListRolesUseCase } from './application/ports/inbound/roles/list-roles.use-case';
import { ListRolesService } from './application/use-cases/roles/list-roles.use-case';
import { UpdateRoleService } from './application/use-cases/roles/update-role.use-case';
import { UpdateRoleUseCase } from './application/ports/inbound/roles/update-role.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TokenEntity,
      RoleEntity,
      PermissionEntity,
      ResetPasswordEntity,
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    UsersModule,
    NotificationsModule,
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
    AuthenticationService,
    {
      provide: TokenRepository,
      useClass: TypeOrmTokenRepository,
    },
    {
      provide: RoleRepository,
      useClass: TypeOrmRoleRepository,
    },
    {
      provide: ResetPasswordRepository,
      useClass: TypeOrmResetPasswordRepository,
    },
    {
      provide: SignUpUseCase,
      useClass: SignUpService,
    },
    {
      provide: SignInUseCase,
      useClass: SignInService,
    },
    {
      provide: RefreshTokenUseCase,
      useClass: RefreshTokenService,
    },
    {
      provide: ForgotPasswordUseCase,
      useClass: ForgotPasswordService,
    },
    {
      provide: ResetPasswordUseCase,
      useClass: ResetPasswordService,
    },
    {
      provide: CreateRoleUseCase,
      useClass: CreateRoleService,
    },
    {
      provide: DeleteRoleUseCase,
      useClass: DeleteRoleService,
    },
    {
      provide: GetRoleUseCase,
      useClass: GetRoleService,
    },
    {
      provide: ListRolesUseCase,
      useClass: ListRolesService,
    },
    {
      provide: UpdateRoleUseCase,
      useClass: UpdateRoleService,
    },
  ],
  controllers: [AuthenticationController, RolesController],
})
export class IamModule {}
