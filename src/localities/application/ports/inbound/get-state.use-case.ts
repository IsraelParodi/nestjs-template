import { State } from '@localities/domain/entities/state';

export abstract class GetStateUseCase {
  abstract execute(countryId: number, stateId: number): Promise<State>;
}
