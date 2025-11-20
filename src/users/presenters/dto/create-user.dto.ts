import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
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

  @IsString()
  @IsOptional()
  phoneCode: string;

  @IsNumberString()
  @IsOptional()
  phone?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
