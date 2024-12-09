import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleType } from '../enums/role-type.enum';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.REGULAR,
    unique: true,
    nullable: false,
  })
  name: RoleType;

  @Column({
    nullable: true,
  })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
