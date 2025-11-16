import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../ports/outbound/user.repository';
import { DeleteUserUseCase } from '../ports/inbound/delete-user.use-case';

@Injectable()
export class DeleteUserService implements DeleteUserUseCase {
  private readonly logger: Logger = new Logger(DeleteUserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, deletedBy: number): Promise<void> {
    await this.userRepository.delete(id, deletedBy);
  }
}
