import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { InsertResult } from 'typeorm';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard';
import { AuthLoginDTO } from './dtos/auth-login.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { Request as ExpressRequest } from 'express';
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

  @Post('login')
  async login(@Body() authData: AuthLoginDTO): Promise<any> {
    const { accessToken, refreshToken } =
      await this.authService.login(authData);

    return {
      message: 'User logged in successfully',
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh-tokens')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@Request() req: ExpressRequest) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      (req.user as any).token,
      req.headers.authorization.split(' ')[1],
      (req.user as any).expiresAt,
    );
    return {
      message: 'Tokens refreshed successfully',
      accessToken,
      refreshToken,
    };
  }
}
