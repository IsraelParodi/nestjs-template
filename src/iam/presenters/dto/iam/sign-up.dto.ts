import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

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
}
