import { Injectable, Logger } from '@nestjs/common';
import { ComplainsRepository } from '../ports/outbound/complains.repository';
import { UpdateComplainUseCase } from '../ports/inbound/update-complain.use-case';
import { UpdateComplainsDto } from '@complains/presenters/dto/update-complains.dto';
import { UserRepository } from '@users/application/ports/outbound/user.repository';

@Injectable()
export class UpdateComplainService implements UpdateComplainUseCase {
  private readonly logger: Logger = new Logger(UpdateComplainService.name);

  constructor(
    private readonly complainsRepository: ComplainsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: number, updateComplainsDto: UpdateComplainsDto) {
    const complains = await this.complainsRepository.findById(id);

    const { updatedBy: userUpdater } = updateComplainsDto;

    const updater = await this.userRepository.findById(userUpdater);

    this.logger.debug(`Updater found: ${JSON.stringify(updater)}`);

    Object.assign(complains, updateComplainsDto);
    complains.updatedBy = updater;

    return this.complainsRepository.update(complains);
  }
}
