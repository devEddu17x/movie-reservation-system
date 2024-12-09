import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: false,
    length: 50,
  })
  name: string;

  @Column({
    nullable: false,
    unique: false,
    length: 50,
  })
  lastname: string;

  @Column({
    nullable: false,
    unique: true,
    length: 50,
  })
  email: string;

  @Column({
    nullable: false,
    unique: false,
    length: 25,
  })
  password: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'time with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'time with time zone',
  })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
