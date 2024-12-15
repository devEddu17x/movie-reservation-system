import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';
import { RoleType } from '../enums/role-type.enum';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Matches(/\S/, { message: 'Name must not contain only whitespace' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Matches(/\S/, { message: 'Name must not contain only whitespace' })
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @IsNotEmpty()
  @Length(1, 25)
  @Matches(/\S/, { message: 'Name must not contain only whitespace' })
  password: string;

  @IsOptional()
  @IsEnum(RoleType, { message: 'role must be a valid enum value' })
  role: RoleType;
}
