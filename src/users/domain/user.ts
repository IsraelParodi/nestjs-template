import { Role } from './role';

export class User {
  public email: string;
  public password: string;
  public role: Role;

  constructor(public id?: number) {}
}
