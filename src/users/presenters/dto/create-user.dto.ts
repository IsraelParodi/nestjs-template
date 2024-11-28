import { IsEmail, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  @IsNumber()
  role: number;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
