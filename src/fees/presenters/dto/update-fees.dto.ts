import { CreateFeeDto } from './create-fees.dto';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFeeDto extends PartialType(CreateFeeDto) {
  @IsNumber()
  @IsOptional()
  updatedBy?: number;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
