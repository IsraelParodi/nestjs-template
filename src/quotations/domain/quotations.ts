import { User } from '@users/domain/user';
import { Country } from '@localities/domain/country';

export class Quotations {
  public id?: number;
  public code: string;
  public name: string;
  public lastname: string;
  public userType: string;
  public email: string;
  public phone: string;
  public phoneCode: string;
  public transportType: string;

  public documentType: string;
  public documentNumber: string;
  public shippingType: string;
  public cargoVolume: number;
  public containerCode: string;
  public origin: string;
  public destination: string;

  public country: Partial<Country>;
  public industryType: string;

  public createdBy?: User;
  public updatedBy?: User;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(id?: number) {
    this.id = id;
  }
}
