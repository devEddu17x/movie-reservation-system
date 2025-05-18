import { Controller, Param, Patch } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UseAdminGuard } from 'src/core/shared/decorators/protected.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('promote/:id')
  @UseAdminGuard()
  async promoteUser(@Param('id') id: string): Promise<any> {
    const result = await this.userService.promoteToAdmin(id);
    return result.affected === 1
      ? { message: 'User promoted to admin' }
      : { message: 'Can not promote user' };
  }
}
