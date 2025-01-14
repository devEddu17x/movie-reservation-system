import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDTO } from '../dtos/create-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/core/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/core/shared/guards/roles.guard';
import { RoleType } from '../enums/role-type.enum';

@Controller('role')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async createRole(@Body() role: CreateRoleDTO): Promise<any> {
    return this.roleService.createRole(role);
  }
}
