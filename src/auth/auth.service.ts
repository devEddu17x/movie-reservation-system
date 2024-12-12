import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interfaces/paylod.interface';
import { AuthLoginDTO } from './dtos/auth-login.dto';
import { UserService } from 'src/user/services/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(user: User) {
    const payload: Payload = {
      id: user.id,
      name: user.name,
      role: user.role.name,
    };

    const token = this.generateToken(payload);
    return token;
  }
  async validate(authData: AuthLoginDTO) {
    const user: User = await this.userService.getUserByEmail(authData.email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    if (!this.userService.validateUser(user, authData.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(user);
    return user;
  }
  generateToken(payload: Payload): string {
    return this.jwtService.sign(payload);
  }
  verifyToken(token: string): Payload | null {
    return this.jwtService.verify(token);
  }
}
