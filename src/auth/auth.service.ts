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
import { RefreshTokenService } from './refresh-token.service';
import { Response } from 'express';
import { refreshTokenCookie } from './config/refresh-token-cookie.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(authData: AuthLoginDTO, res: Response) {
    const user = await this.validateLogin(authData);
    return await this.generateTokens(user, res);
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
    res: Response,
    previousRefreshToken?: string,
    previousExpiresAt?: Date,
  ): Promise<{ accessToken: string }> {
    // in login we don't have previous refresh token, so we don't need to check it
    if (previousRefreshToken) {
      if (
        await this.refreshTokenService.checkIfTokenInBlackList(
          previousRefreshToken,
        )
      ) {
        throw new UnauthorizedException('Token has been invalidated');
      }
      await this.refreshTokenService.addTokenToBlackList(
        previousRefreshToken,
        previousExpiresAt,
      );
    }
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

    res.cookie(
      refreshTokenCookie.name,
      refreshToken,
      refreshTokenCookie.options,
    );

    return { accessToken };
  }
}
