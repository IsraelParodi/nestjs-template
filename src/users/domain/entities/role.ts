import { Permission } from './permission';

export class Role {
  public description: string;
  public permissions: Permission[];

  constructor(
    public id?: number,
    public name?: string,
  ) {}
}
