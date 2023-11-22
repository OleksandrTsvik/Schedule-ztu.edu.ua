import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { UserEntity } from '../user/user.entity';

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

  @Column('varchar', { nullable: true })
  cabinetLogin: string | null;

  @Exclude()
  @Column('varchar', { nullable: true })
  cabinetPassword: string | null;

  @Exclude()
  @Column('simple-array', { default: '' })
  scheduleTimes: string[];

  @Exclude()
  @OneToOne(() => UserEntity, (user) => user.scheduleSettings)
  @JoinColumn()
  user: UserEntity;
}
