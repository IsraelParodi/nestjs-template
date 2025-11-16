import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateListOfValuesDetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
