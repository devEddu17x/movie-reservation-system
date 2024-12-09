import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
})
export class UserModule {}
