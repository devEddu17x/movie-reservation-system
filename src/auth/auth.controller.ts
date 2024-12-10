import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { InsertResult } from 'typeorm';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @UseGuards(DynamicAuthGuard)
  async createUser(@Body() user: CreateUserDTO): Promise<any> {
    const result: InsertResult = await this.userService.createUser(user);
    return {
      message: 'User created successfully',
      data: result.generatedMaps,
    };
  }
}
