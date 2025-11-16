import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { State } from '@localities/domain/entities/state';
import { StateRepository } from '../ports/outbound/state.repository';
import { GetStateUseCase } from '../ports/inbound/get-state.use-case';

@Injectable()
export class GetStateService implements GetStateUseCase {
  private readonly logger: Logger = new Logger(GetStateService.name);

  constructor(private readonly stateRepositoryPort: StateRepository) {}

  async execute(countryId: number, stateId: number): Promise<State> {
    const state = await this.stateRepositoryPort.findByCountryAndStateId(
      countryId,
      stateId,
    );

    if (!state) {
      throw new NotFoundException(`State with ID ${stateId} not found`);
    }

    return state;
  }
}
