import { IsString, Length } from 'class-validator';
import { IsEnum } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';

export class CreateRoleDTO {
  @IsEnum(RoleType, { message: 'name must be a valid enum value' })
  name: RoleType;

  @IsString()
  @Length(1, 255)
  description: string;
}
