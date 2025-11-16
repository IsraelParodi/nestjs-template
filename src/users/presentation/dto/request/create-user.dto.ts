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
  roleId: number;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  businessTaxId: string;

  @IsString()
  legalName: string;

  @IsNumber()
  countryId: number;

  @IsString()
  @IsOptional()
  phoneCode?: string;

  @IsNumberString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
