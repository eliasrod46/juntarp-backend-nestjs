import { IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  name: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
