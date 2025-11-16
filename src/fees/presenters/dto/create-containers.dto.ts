import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFeeDto } from './create-fees.dto';

export class CreateContainerDto {
  @IsOptional()
  readonly id?: number;

  @IsString()
  @IsNotEmpty()
  readonly size: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFeeDto)
  readonly fee?: CreateFeeDto;

  @IsDateString()
  @IsOptional()
  readonly createdAt?: Date;

  @IsDateString()
  @IsOptional()
  readonly updatedAt?: Date;
}
