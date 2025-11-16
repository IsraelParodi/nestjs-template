import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateComplainsDto } from './create-complains.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateComplainsDto extends OmitType(
  PartialType(CreateComplainsDto),
  ['createdBy'],
) {
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
