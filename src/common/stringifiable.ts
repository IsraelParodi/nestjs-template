export class Stringifiable {
  constructor(private readonly value: any) {}

  toString() {
    if (typeof this.value !== 'object') {
      return String(this.value);
    }
  }
}
