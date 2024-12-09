import { Body, Controller, Post } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDTO } from '../dtos/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async createRole(@Body() role: CreateRoleDTO): Promise<any> {
    return this.roleService.createRole(role);
  }
}
