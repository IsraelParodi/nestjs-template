import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../ports/outbound/user.repository';
import { DeleteManyUsersUseCase } from '../ports/inbound/delete-many-users.use-case';

@Injectable()
export class DeleteManyUsersService implements DeleteManyUsersUseCase {
  private readonly logger: Logger = new Logger(DeleteManyUsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(ids: number[], deletedBy: number): Promise<void> {
    await this.userRepository.deleteMany(ids, deletedBy);
  }
}
