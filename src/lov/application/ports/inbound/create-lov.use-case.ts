import { CreateListOfValuesDto } from '@lov/presenters/dto/create-lov.dto';

export abstract class CreateLovUseCase {
  abstract execute(createListOfValuesDto: CreateListOfValuesDto);
}
