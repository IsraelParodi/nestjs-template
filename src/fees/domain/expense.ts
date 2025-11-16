import { Fee } from '@fees/domain/fee';
import { User } from '@users/domain/user';

export class Expense {
  public unit: string;
  public description: string;
  public title: string;
  public amount: number;
  public fee?: Fee;
  public createdAt?: Date;
  public createdBy?: User;
  public updatedAt?: Date;
  public updatedBy?: User;

  constructor(public id?: number) {}
}
