import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateListOfValuesDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
