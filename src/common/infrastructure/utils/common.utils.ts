class Stringifiable {
  constructor(private readonly value: any) {}

  toString() {
    if (typeof this.value !== 'object') {
      return String(this.value);
    }
  }
}

export function structuredObject(obj: Record<string, any>): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${new Stringifiable(value)}`)
    .join(', ');
}
