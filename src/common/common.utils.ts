import { Stringifiable } from './stringifiable';

export function structuredObject(obj: Record<string, any>): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${new Stringifiable(value)}`)
    .join(', ');
}
