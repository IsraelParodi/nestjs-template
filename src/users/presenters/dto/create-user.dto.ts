import { IsEmail, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  @IsNumber()
  role: number;
}
