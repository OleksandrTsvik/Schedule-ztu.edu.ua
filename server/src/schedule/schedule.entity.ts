import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
