export class State {
  public readonly id: number;
  public name: string;
  public countryId: number;
  public countryCode: string;
  public fipsCode?: string;
  public iso2?: string;
  public type?: string;
  public latitude?: number;
  public longitude?: number;
  public createdAt?: Date;
  public updatedAt: Date;
  public flag: number;
  public wikiDataId?: string;

  constructor(id: number) {
    this.id = id;
  }
}
