import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { InsertResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: CreateUserDTO): Promise<any> {
    const result: InsertResult = await this.userService.createUser(user);
    return {
      message: 'User created successfully',
      data: result.generatedMaps,
    };
  }
}
