import { Role } from '../../domain/entities/role.entity';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
}
