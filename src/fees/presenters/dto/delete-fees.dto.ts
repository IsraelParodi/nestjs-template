import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContainerDto } from './create-containers.dto';
import { CreateExpenseDto } from './create-expenses.dto';

export class CreateFeeDto {
  @IsOptional()
  readonly id?: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDateString()
  @IsNotEmpty()
  readonly startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  readonly endDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly currency: string;

  @IsString()
  @IsNotEmpty()
  readonly regime: string;

  @IsString()
  @IsNotEmpty()
  readonly customsOffice: string;

  @IsString()
  @IsNotEmpty()
  readonly shipmentType: string;

  @IsString()
  @IsNotEmpty()
  readonly origin: string;

  @IsString()
  @IsNotEmpty()
  readonly destination: string;

  @ValidateNested({ each: true })
  @Type(() => CreateContainerDto)
  readonly containers: CreateContainerDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateExpenseDto)
  readonly expenses: CreateExpenseDto[];

  @IsOptional()
  @IsString()
  readonly notes?: string;

  @IsOptional()
  @IsString()
  readonly observations?: string;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
