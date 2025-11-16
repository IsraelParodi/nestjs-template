import { Injectable, Logger } from '@nestjs/common';
import { User } from '@users/domain/entities/user';
import {
  PaginationOptions,
  UserRepository,
} from '../ports/outbound/user.repository';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ListUsersUseCase } from '../ports/inbound/list-users.use-case';
import { ListUsersQuery } from '../queries/list-users.query';

@Injectable()
export class ListUsersService implements ListUsersUseCase {
  private readonly logger: Logger = new Logger(ListUsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    page,
    limit,
    ...filters
  }: ListUsersQuery): Promise<PaginatedResult<User>> {
    const options: PaginationOptions = {
      page,
      limit,
      filters,
    };
    return this.userRepository.findAllPaginated(options);
  }
}
