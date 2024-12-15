import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/user/enums/role-type.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...args: RoleType[]) => SetMetadata(ROLES_KEY, args);
