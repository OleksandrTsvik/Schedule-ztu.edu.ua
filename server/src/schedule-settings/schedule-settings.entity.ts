import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { UserEntity } from '../auth/user.entity';

@Entity('schedule_settings')
export class ScheduleSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  scheduleForGroup: string;

  @Column('date')
  dateFirstWeekSchedule: Date;

  @Column({ nullable: true })
  linkToSelectiveSubjects?: string;

  @Column({ default: 1 })
  weekForSelectiveSubjects: number;

  @Column({ default: false })
  isLoadCabinentContent: boolean;

  @Column({ nullable: true })
  cabinetLogin?: string;

  @Exclude()
  @Column({ nullable: true })
  cabinetPassword?: string;

  @Exclude()
  @Column('simple-array', { default: '' })
  scheduleTimes: string[];

  @Exclude()
  @OneToOne(() => UserEntity, (user) => user.scheduleSettings)
  @JoinColumn()
  user: UserEntity;
}
