export class Country {
  public readonly id: number;
  public name: string;
  public iso3?: string;
  public numericCode?: string;
  public iso2?: string;
  public phoneCode?: string;
  public capital?: string;
  public currency?: string;
  public currencyName?: string;
  public currencySymbol?: string;
  public tld?: string;
  public native?: string;
  public region?: string;
  public regionId?: number;
  public subregion?: string;
  public subregionId?: number;
  public nationality?: string;
  public timezones?: string;
  public translations?: string;
  public latitude?: number;
  public longitude?: number;
  public emoji?: string;
  public emojiU?: string;
  public createdAt: Date;
  public updatedAt: Date;
  public flag: number;
  public wikiDataId?: string;

  constructor(id: number) {
    this.id = id;
  }
}
