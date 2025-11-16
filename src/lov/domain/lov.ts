import { User } from '@users/domain/user';
import { ListOfValuesDetail } from './lov-detail';

export class ListOfValues {
  public key: string;
  public description: string;
  public values?: ListOfValuesDetail[];

  public createdBy?: User;
  public updatedBy?: User;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(public id?: number) {}
}
