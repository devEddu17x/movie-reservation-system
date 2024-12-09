import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from '../dtos/create-role.dto';
import { RoleType } from '../enums/role-type.enum';
@Injectable()
export class RoleService implements OnModuleInit {
  private rolesMap: Map<RoleType, Role> = new Map();
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(role: CreateRoleDTO): Promise<Role> {
    return this.roleRepository.save(role);
  }

  async onModuleInit() {
    // get all roles from the database
    const roles = await this.roleRepository.find();
    // insert roles on record
    roles.forEach((role) => {
      this.rolesMap.set(role.name, role);
    });

    // check if default roles are in the database
    if (
      !this.rolesMap.get(RoleType.REGULAR) ||
      !this.rolesMap.get(RoleType.ADMIN)
    ) {
      throw new Error('Default roles not found in the database');
    }
  }

  getRole(roleType: RoleType): Role {
    const role: Role = this.rolesMap.get(roleType);

    if (!role) {
      throw new BadRequestException(`Role ${roleType} not found`);
    }
    return role;
  }
}
