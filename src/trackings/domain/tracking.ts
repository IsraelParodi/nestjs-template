import { User } from '@users/domain/user';
import { Container } from './container';
import { Seal } from './seal';

export class Tracking {
  public id?: number;
  public consignee: User;
  public notifier: User;
  public shipper: string;
  public routing: string;
  public customsOffice: string;
  public blAuthorization: string;
  public regime: string;
  public mbl_mawb: string;
  public hbl_mawb: string;
  public origin: string;
  public destination: string;
  public etd: Date;
  public eta: Date;
  public containers: Container[];
  public seals: Seal[];
  public notes?: string;
  public observations?: string;
  public createdAt?: Date | null;
  public createdBy?: User | null;
  public updatedAt?: Date | null;
  public updatedBy?: User | null;

  constructor(id?: number) {
    this.id = id;
  }
}
