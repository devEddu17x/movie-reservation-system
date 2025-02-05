import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { RoleType } from 'src/user/enums/role-type.enum';

@Injectable()
export class DynamicAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // this happens cause this guard it's used for creating new users
    // we need to check jwt only in case dto in request has role field and is admin
    // only an admin can create an admin, so check if role inside jwt is admin
    // in case role is regular or is empty (taking regular as default in user service) return true
    if (!body.role || body.role === RoleType.REGULAR) {
      return true;
    }

    // if not then is admin, so check jwt

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new ForbiddenException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      if (decoded.role !== 'admin') {
        throw new ForbiddenException(
          'You do not have permission to assign the admin role',
        );
      }
      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
