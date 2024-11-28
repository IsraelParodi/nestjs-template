import { Role } from './role';

export class User {
  public email: string;
  public password: string;
  public role: Role;
  public createdBy?: User;
  public updatedBy?: User;
  public deletedBy?: User;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  constructor(public id?: number) {}
}
