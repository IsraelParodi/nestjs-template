import { Role } from '@users/domain/entities/role';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
}
