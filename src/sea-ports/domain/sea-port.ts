import { Country } from '@localities/domain/country';

export class SeaPort {
  public readonly id: number;
  public country: Partial<Country>;
  public unlocode: string;
  public iso2Country: string;
  public location: string;
  public name: string;

  constructor(id: number) {
    this.id = id;
  }
}
