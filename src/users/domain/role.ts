import { Permission } from './permission';

export class Role {
  public name: string;
  public description: string;
  public permissions: Permission[];

  constructor(public id?: number) {}
}
