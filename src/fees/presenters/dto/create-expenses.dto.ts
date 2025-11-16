import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFeeDto } from './create-fees.dto';

export class CreateExpenseDto {
  @IsOptional()
  readonly id?: number;

  @IsString()
  @IsNotEmpty()
  readonly unit: string;

  @IsNumber()
  readonly amount: string;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

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
