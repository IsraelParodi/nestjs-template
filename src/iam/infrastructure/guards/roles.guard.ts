import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ActiveUserData } from '@iam/infrastructure/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '@iam/infrastructure/iam.constants';
import { RoleEnum } from '@common/infrastructure/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!contextRoles) {
      return true;
    }

    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    const allowed = contextRoles.includes(user.role?.name as RoleEnum);

    if (!allowed) {
      throw new ForbiddenException('No cuenta con permisos para acceder');
    }

    return allowed;
  }
}
