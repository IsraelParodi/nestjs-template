import { User } from '@users/domain/user';
import { ListOfValues } from './lov';

export class ListOfValuesDetail {
  public key: ListOfValues;
  public name: string;
  public detail: string;

  public createdBy?: User;
  public updatedBy?: User;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(public id?: number) {}
}
