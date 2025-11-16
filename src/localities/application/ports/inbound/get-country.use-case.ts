import { Country } from '@localities/domain/entities/country';

export abstract class GetCountryUseCase {
  abstract execute(id: number): Promise<Country>;
}
