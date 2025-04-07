import { IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDocenteDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  lastname: string;

  @IsString()
  @MinLength(7)
  dni: string;
}

export class UpdateDocenteDto extends PartialType(CreateDocenteDto) {}
