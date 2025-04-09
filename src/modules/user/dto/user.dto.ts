import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsEmail,
  IsString,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPasswords', async: false })
export class MatchPasswords implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const obj = args.object as any; // Cast to 'any' or a more specific type if you know it
    return obj.newPassword === confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must match new password`;
  }
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  lastname: string;

  @IsString()
  @MinLength(2)
  username: string;

  @IsString()
  @MinLength(7)
  dni: string;

  @IsEmail()
  email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @MinLength(8)
  @Validate(MatchPasswords)
  confirmPassword: string;
}

export class AssignRolesUserDto {
  @IsString()
  user_id: string;

  @IsArray()
  roles_id: string[];
}
