import { Country } from '@localities/domain/country';
import { Role } from './role';

export class User {
  public email: string;
  public password: string;
  public role: Role;
  public name: string;
  public lastname: string;
  public businessTaxId: string;
  public legalName: string;
  public country?: Partial<Country>;
  public phoneCode?: string;
  public phone?: string;
  public address?: string;
  public createdBy?: User;
  public updatedBy?: User;
  public deletedBy?: User;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  constructor(public id?: number) {}
}
