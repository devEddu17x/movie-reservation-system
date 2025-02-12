import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/services/user.service';
import { RefreshTokenPayload } from '../interfaces/paylod.interface';
import { Request } from 'express';
import { extractRefreshTokenFromCookie } from '../config/refresh-token-cookie.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => extractRefreshTokenFromCookie(req),
      ]),
      secretOrKey: configService.get<string>('auth.refreshSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: RefreshTokenPayload) {
    // to validate the refresh token, we need to check if the user exists
    // also we keep user data up to date
    const user = await this.userService.getUserById(payload.sub);
    return {
      token: {
        id: payload.sub,
        email: user.email,
        role: user.role,
      },
      expiresAt: new Date(payload.exp * 1000),
    };
  }
}
