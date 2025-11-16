import { Tracking } from '@trackings/domain/tracking';
import { User } from '@users/domain/user';

export class Seal {
  public name: string;
  public containerCode: string;
  public description: string;
  public tracking: Tracking;
  public createdAt?: Date;
  public createdBy?: User;
  public updatedAt?: Date;
  public updatedBy?: User;

  constructor(public id?: number) {}
}
