import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ListUsersQuery } from '@users/application/queries/list-users.query';
import { User } from '@users/domain/entities/user';

export abstract class ListUsersUseCase {
  abstract execute(query: ListUsersQuery): Promise<PaginatedResult<User>>;
}
