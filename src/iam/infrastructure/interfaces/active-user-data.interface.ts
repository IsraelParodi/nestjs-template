import { Role } from '@users/domain/role';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
}
