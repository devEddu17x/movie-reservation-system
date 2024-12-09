import { Injectable } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { RoleService } from './role.service';
import { RoleType } from '../enums/role-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async createUser(userDTO: CreateUserDTO): Promise<InsertResult> {
    const { role, ...userData } = userDTO;

    const userRole = this.roleService.getRole(role || RoleType.REGULAR);

    const user = this.userRepository.create({
      ...userData,
      role: { id: userRole.id },
    });

    const result = this.userRepository.insert(user);
    console.log(result);
    return result;
  }
}
