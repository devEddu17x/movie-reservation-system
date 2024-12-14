import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RoleType } from '../enums/role-type.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('promote/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async promoteUser(@Param('id') id: string): Promise<any> {
    const result = await this.userService.promoteToAdmin(id);
    return result.affected === 1
      ? { message: 'User promoted to admin' }
      : { message: 'Can not promote user' };
  }
}
