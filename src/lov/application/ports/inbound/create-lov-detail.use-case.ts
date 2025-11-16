import { CreateListOfValuesDetailDto } from '@lov/presenters/dto/create-lov-detail.dto';

export abstract class CreateLovDetailUseCase {
  abstract execute(
    createListOfValuesDto: CreateListOfValuesDetailDto,
    key: string,
  );
}
