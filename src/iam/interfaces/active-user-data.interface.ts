import { Role } from '../authorization/entities/role.entity';
import { PermissionType } from '../authorization/permission.type';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
  permissions: PermissionType[];
}
