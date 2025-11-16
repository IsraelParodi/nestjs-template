import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSealDto {
  @IsOptional()
  readonly id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  containerCode: string;

  @IsString()
  @IsNotEmpty()
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
