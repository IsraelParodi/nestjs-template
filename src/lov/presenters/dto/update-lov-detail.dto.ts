import { OmitType, PartialType } from '@nestjs/mapped-types';

import { IsNumber, IsOptional } from 'class-validator';

import { CreateListOfValuesDetailDto } from './create-lov-detail.dto';

export class UpdateListOfValuesDetailDto extends OmitType(
  PartialType(CreateListOfValuesDetailDto),
  ['createdBy'],
) {
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
