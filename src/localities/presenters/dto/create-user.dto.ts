import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  @IsNumber()
  role: number;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  businessTaxId: string;

  @IsString()
  legalName: string;

  @IsNumber()
  country?: number;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
