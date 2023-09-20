import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export class SettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  scheduleForGroup: string;

  @Column('date')
  dateFirstWeekSchedule: Date;

  @Column()
  linkToSelectiveSubjects: string;

  @Column()
  cabinetLogin: string;

  @Column()
  cabinetPassword: string;
}
