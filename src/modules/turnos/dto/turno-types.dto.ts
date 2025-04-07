import { IsNumber, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTurnoTypesDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber()
  quantity_dates: number;
}

export class UpdateTurnoTypesDto extends PartialType(CreateTurnoTypesDto) {}
