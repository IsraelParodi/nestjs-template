import { IsNumber, IsOptional } from 'class-validator';

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateListOfValuesDto } from './create-lov.dto';

export class UpdateListOfValuesDto extends OmitType(PartialType(CreateListOfValuesDto), ['createdBy']) {
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
