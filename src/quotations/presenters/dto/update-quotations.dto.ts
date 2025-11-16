import { CreateQuotationsDto } from './create-quotations.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateQuotationsDto extends PartialType(CreateQuotationsDto) {
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
