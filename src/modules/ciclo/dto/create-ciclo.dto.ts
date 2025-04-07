import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCicloDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber()
  year: number;

  @IsDateString({})
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsString()
  @IsOptional()
  details: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
