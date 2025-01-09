import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/services/user.service';
import { RefreshTokenPayload } from '../interfaces/paylod.interface';

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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.refreshSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: RefreshTokenPayload) {
    // to validate the refresh token, we need to check if the user exists
    await this.userService.getUserById(payload.sub);
    return { id: payload.sub };
  }
}
