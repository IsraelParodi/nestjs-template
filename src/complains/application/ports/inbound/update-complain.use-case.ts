import { UpdateComplainsDto } from '@complains/presenters/dto/update-complains.dto';

export abstract class UpdateComplainUseCase {
  abstract execute(id: number, updateComplainsDto: UpdateComplainsDto);
}
