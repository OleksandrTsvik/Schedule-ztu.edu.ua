import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { UserEntity } from '../user/user.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column()
  expires: number;

  @Column('integer', { nullable: true })
  revoked: number | null;

  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  @JoinColumn()
  user: UserEntity;
}
