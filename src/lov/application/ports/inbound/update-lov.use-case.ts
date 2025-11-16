import { UpdateListOfValuesDto } from '@lov/presenters/dto/update-lov.dto';

export abstract class UpdateLovUseCase {
  abstract execute(id: number, updateListOfValuesDto: UpdateListOfValuesDto);
}
