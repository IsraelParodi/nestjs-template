import { UpdateListOfValuesDetailDto } from '@lov/presenters/dto/update-lov-detail.dto';

export abstract class UpdateLovDetailUseCase {
  abstract execute(
    id: number,
    updateListOfValuesDetailDto: UpdateListOfValuesDetailDto,
  );
}
