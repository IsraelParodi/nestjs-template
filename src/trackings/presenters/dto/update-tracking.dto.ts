import { CreateTrackingDto } from './create-tracking.dto';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTrackingDto extends PartialType(CreateTrackingDto) {
  @IsNumber()
  @IsOptional()
  updatedBy?: number;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
