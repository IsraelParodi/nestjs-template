import { User } from '@users/domain/user';
import { Container } from './container';
import { Expense } from './expense';
import { SeaPort } from '@sea-ports/domain/sea-port';

export class Fee {
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public currency: string;
  public regime: string;
  public customsOffice: string;
  public shipmentType: string;
  public origin: string;
  public originEntity: Partial<SeaPort>;
  public destination: string;
  public destinationEntity: Partial<SeaPort>;
  public containers: Container[];
  public expenses: Expense[];
  public notes?: string;
  public amount?: number = 0;
  public observations?: string;
  public createdAt?: Date | null;
  public createdBy?: User | null;
  public updatedAt?: Date | null;
  public updatedBy?: User | null;

  constructor(public id?: number) {}
}
