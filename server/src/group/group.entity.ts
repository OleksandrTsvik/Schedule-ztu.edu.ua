import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FacultyEntity } from './faculty.entity';

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Exclude()
  @ManyToOne(() => FacultyEntity, (faculty) => faculty.groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  faculty: FacultyEntity;
}
