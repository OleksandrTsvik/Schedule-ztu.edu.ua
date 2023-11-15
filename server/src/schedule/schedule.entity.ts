import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { UserEntity } from '../auth/user.entity';

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  week: number;

  @Column()
  weekday: number;

  @Column()
  time: string;

  @Column()
  subject: string;

  @Column()
  classroom: string;

  @Column('simple-array')
  teachers: string[];

  @Column('simple-array')
  groups: string[];

  @Column('boolean', { default: true })
  show: boolean;

  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.schedule)
  @JoinColumn()
  user: UserEntity;
}
