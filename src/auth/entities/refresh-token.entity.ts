import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class BlackListRefreshToken {
  @PrimaryColumn({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
