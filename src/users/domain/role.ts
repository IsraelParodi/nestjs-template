import { Permission } from './permission';

export class Role {
  public name: string;
  public permissions: Permission[];

  constructor(public id?: number) {}
}
