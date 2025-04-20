import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  @IsNotEmpty({ message: 'email El dni/usuario/email es obligatorio.' })
  @MinLength(5, {
    message: 'email El dni/usuario/email debe tener al menos 5 caracteres.',
  })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'password El password es obligatorio.' })
  @MinLength(8, {
    message: 'password El password debe tener al menos 8 caracteres.',
  })
  password: string;
}
