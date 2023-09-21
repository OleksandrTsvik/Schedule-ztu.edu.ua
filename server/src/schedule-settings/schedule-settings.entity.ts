import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  cabinetLogin?: string;

  @Exclude()
  @Column({ nullable: true })
  cabinetPassword?: string;
}
