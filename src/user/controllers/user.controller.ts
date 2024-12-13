import { Controller, Param, Patch } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('promote/:id')
  async promoteUser(@Param('id') id: string): Promise<any> {
    const result = this.userService.promoteToAdmin(id);
    return result;
  }
}
