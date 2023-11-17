import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { ScheduleSettingsEntity } from '../schedule-settings/schedule-settings.entity';
import { ScheduleEntity } from '../schedule/schedule.entity';
import { RefreshTokenEntity } from '../refresh-token/refresh-token.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @OneToMany(() => ScheduleEntity, (schedule) => schedule.user)
  schedule: ScheduleEntity[];

  @Exclude()
  @OneToOne(
    () => ScheduleSettingsEntity,
    (scheduleSettings) => scheduleSettings.user,
  )
  scheduleSettings: ScheduleSettingsEntity;

  @Exclude()
  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];
}
