import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
// import { Origin } from '../entities/folder.entity';

export class CreateFolderDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  details?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  observations?: string;

  @IsOptional()
  @IsDateString()
  income_date?: string;

  @IsOptional()
  @IsDateString()
  outcome_date?: string;

  @IsOptional()
  @IsNumber()
  state?: number;

  @IsOptional()
  @IsNumber()
  originFile?: number;

  @IsString()
  docenteId: string;
}

export class UpdateFolderDto extends PartialType(CreateFolderDto) {}
