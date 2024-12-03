import { Role } from 'src/users/domain/role';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
}
