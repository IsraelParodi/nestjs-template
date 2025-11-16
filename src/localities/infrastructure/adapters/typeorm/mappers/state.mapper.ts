import { State } from '@localities/domain/entities/state';
import { StateEntity } from '../entities/states.entity';

export class StateMapper {
  static toDomain(entity: StateEntity): State {
    const state = new State(entity.id);

    state.name = entity.name;
    state.countryId = entity.countryId;
    state.countryCode = entity.countryCode;
    state.fipsCode = entity.fipsCode;
    state.iso2 = entity.iso2;
    state.type = entity.type;
    state.latitude = entity.latitude;
    state.longitude = entity.longitude;
    state.createdAt = entity.createdAt;
    state.updatedAt = entity.updatedAt;
    state.flag = entity.flag;
    state.wikiDataId = entity.wikiDataId;

    return state;
  }

  static toPersistence(state: State): StateEntity {
    const entity = new StateEntity();

    entity.id = state?.id;
    entity.name = state.name;
    entity.countryId = state.countryId;
    entity.countryCode = state.countryCode;
    entity.fipsCode = state.fipsCode;
    entity.iso2 = state.iso2;
    entity.type = state.type;
    entity.latitude = state.latitude;
    entity.longitude = state.longitude;
    entity.createdAt = state.createdAt;
    entity.updatedAt = state.updatedAt;
    entity.flag = state.flag;
    entity.wikiDataId = state.wikiDataId;

    return entity;
  }
}
