import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleType } from 'src/user/enums/role-type.enum';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function UseAdminGuard() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(RoleType.ADMIN),
  );
}

export function UseUserGuard() {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard));
}
