import { Tracking } from '@trackings/domain/tracking';
import { User } from '@users/domain/user';

export class Container {
  public code: string;
  public quantity: number;
  public kbr: number;
  public m3: number;
  public description: string;
  public tracking: Tracking;
  public createdAt?: Date;
  public createdBy?: User;
  public updatedAt?: Date;
  public updatedBy?: User;

  constructor(public id?: number) {}
}
