import { IsArray, IsString, MinLength, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { CreatePermissionDto } from './permission.dto';

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  name: string;
}

export class AssignPermissionsToRolDto {
  @IsArray()
  @ValidateNested({ each: true }) // 'each: true' valida cada elemento del arreglo
  @Type(() => CreatePermissionDto) // Especifica el tipo de los elementos del arreglo
  permissions: CreatePermissionDto[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
