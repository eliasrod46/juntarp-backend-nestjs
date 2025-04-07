import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(3)
  name: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginAuthDto {
  @IsString()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  password: string;
}
