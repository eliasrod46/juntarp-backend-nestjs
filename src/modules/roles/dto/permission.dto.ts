import { IsArray, IsString, MinLength, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreatePermissionDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  group: string;

  @IsString()
  @MinLength(2)
  route: string;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}

export class CreateGenericPermissionsDto {
  @IsArray()
  @ValidateNested({ each: true }) // 'each: true' valida cada elemento del arreglo
  @Type(() => CreatePermissionDto) // Especifica el tipo de los elementos del arreglo
  permissions: CreatePermissionDto[];
}
