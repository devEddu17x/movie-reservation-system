import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './interfaces/paylod.interface';
import { AuthLoginDTO } from './dtos/auth-login.dto';
import { UserService } from 'src/user/services/user.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(authData: AuthLoginDTO) {
    const user = await this.validateLogin(authData);
    return await this.generateTokens(user);
  }

  async validateLogin(authData: AuthLoginDTO) {
    const user: User = await this.userService.getUserByEmail(authData.email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isAuthenticated = await this.userService.validateUser(
      user,
      authData.password,
    );
    if (!isAuthenticated) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(accessPayload),
      await this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('auth.refreshSecret'),
        expiresIn: this.configService.get<string>('auth.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
