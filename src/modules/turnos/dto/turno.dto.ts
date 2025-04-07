import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTurnoDto {
  @IsString()
  @MinLength(2)
  inscription_type: string;

  @IsDateString()
  date: string;

  @IsDateString()
  time: string;

  @IsString()
  cicloId: string;

  @IsString()
  turnoTypeId: string;

  @IsNumber()
  @IsOptional()
  docenteId: string;
}

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}
