import { ComplainsStatus } from '@complains/infrastructure/enums/complains-status.enum';
import { Country } from '@localities/domain/entities/country';
import { State } from '@localities/domain/entities/state';
import { User } from '@users/domain/entities/user';

export class Complains {
  public code: string;
  public status: ComplainsStatus;
  public nationalTaxpayerRegistry: string;
  public companyName: string;
  public documentType: string;
  public documentNumber: string;
  public complainerName: string;
  public complainerAddress: string;
  public complainerDistrict: string;
  public complainerPhone: string;
  public complainerPhoneCode: string;
  public complainerEmail: string;
  public complainerState: State;
  public complainerCountry: Country;
  public serviceType: string;
  public currency: string;
  public amountComplained: number;
  public description: string;
  public type: string;
  public detail: string;
  public request: string;
  public emailsCopied: string[] = [];
  public updatedBy?: User;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(public id?: number) {}
}
