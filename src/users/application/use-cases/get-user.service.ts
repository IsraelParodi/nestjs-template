import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@users/domain/entities/user';
import { UserRepository } from '../ports/outbound/user.repository';
import { structuredObject } from '@common/infrastructure/utils/common.utils';
import { GetUserUseCase } from '../ports/inbound/get-user.use-case';

@Injectable()
export class GetUserService implements GetUserUseCase {
  private readonly logger: Logger = new Logger(GetUserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(
        `User with ${structuredObject({ id })} not found`,
      );
    }
    return user;
  }
}
