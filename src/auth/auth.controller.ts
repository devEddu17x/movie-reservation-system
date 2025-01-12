import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { InsertResult } from 'typeorm';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard';
import { AuthLoginDTO } from './dtos/auth-login.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { Request as ExpressRequest, Response } from 'express';
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
  async login(
    @Body() authData: AuthLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken } = await this.authService.login(authData, res);

    return {
      message: 'User logged in successfully',
      accessToken,
    };
  }

  @Post('refresh-tokens')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.generateTokens(
      (req.user as any).token,
      res,
      (req as any).refreshTokenCookie,
      (req.user as any).expiresAt,
    );
    return {
      message: 'Tokens refreshed successfully',
      accessToken,
    };
  }
}
