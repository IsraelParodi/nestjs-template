import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateContainerDto {
  @IsOptional()
  readonly id?: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  kbr: number;

  @IsNumber()
  m3: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  readonly createdAt?: Date;

  @IsOptional()
  readonly createdBy?: any;

  @IsDateString()
  @IsOptional()
  readonly updatedAt?: Date;

  @IsOptional()
  readonly updatedBy?: any;
}
