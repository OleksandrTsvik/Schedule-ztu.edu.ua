import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { GroupEntity } from './group.entity';

@Entity('faculties')
export class FacultyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => GroupEntity, (group) => group.faculty, {
    cascade: true,
  })
  groups: GroupEntity[];
}
