import { Country } from '@localities/domain/country';
import { User } from '@users/domain/user';

export class ContactUs {
  public id?: number;
  public name: string;
  public lastname: string;
  public country: Partial<Country>;
  public phoneCode: string;
  public phone: string;
  public email: string;
  public message: string;
  public acceptPrivacyPolicies: boolean;
  public receiveAdditionalInformation: boolean;

  public createdBy?: User;
  public updatedBy?: User;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(id?: number) {
    this.id = id;
  }
}
