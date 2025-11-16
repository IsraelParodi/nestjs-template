import { Complains } from '@complains/domain/entities/complains';
import { CreateComplainsDto } from '@complains/presenters/dto/create-complains.dto';

export abstract class CreateComplainUseCase {
  abstract execute(createComplainsDto: CreateComplainsDto): Promise<Complains>;
}
