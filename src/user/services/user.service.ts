import { HttpException, Injectable } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { RoleService } from './role.service';
import { RoleType } from '../enums/role-type.enum';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(userDTO: CreateUserDTO): Promise<InsertResult> {
    const { role, ...userData } = userDTO;

    console.log('userData', userData);
    const userRole = this.roleService.getRole(role || RoleType.REGULAR);

    const newPassword = await bcrypt.hash(
      userData.password,
      this.configService.get<number>('auth.rounds'),
    );

    console.log('newPassword ', newPassword);
    const user = this.userRepository.create({
      ...userData,
      password: newPassword,
      role: { id: userRole.id },
    });

    try {
      const result = await this.userRepository.insert(user);
      console.log('result user service \n', result);
      return result;
    } catch (error) {
      console.log('error', error.message);
      if (error.code === '23505') {
        throw new HttpException(
          `User with email <<${userData.email}>> already exists`,
          409,
        );
      }
    }
  }

  async validateUser(user: User, password: string) {
    return await bcrypt.compare(password, user.password);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
