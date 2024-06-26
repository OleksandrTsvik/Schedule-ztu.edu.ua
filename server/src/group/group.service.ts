import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ParsingService } from '../parsing/parsing.service';
import { FacultyEntity } from './faculty.entity';
import { GroupEntity } from './group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(FacultyEntity)
    private readonly facultyRepository: Repository<FacultyEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly parsingService: ParsingService,
  ) {}

  async getAllGroups(): Promise<GroupEntity[]> {
    return this.groupRepository.find({ order: { name: 'ASC' } });
  }

  async getAllFacultiesWithGroups(): Promise<FacultyEntity[]> {
    return this.facultyRepository.find({
      relations: { groups: true },
      order: { name: 'DESC', groups: { name: 'ASC' } },
    });
  }

  async loadFacultiesAndGroups(): Promise<void> {
    const resultParsing = await this.parsingService.parsingGroupsOrFail();
    const facultiesToSave: Omit<FacultyEntity, 'id'>[] = [];

    for (const faculty of resultParsing) {
      const groups = faculty.groups.map((group) => ({
        name: group,
      }));

      facultiesToSave.push({
        name: faculty.faculty,
        groups: groups as GroupEntity[],
      });
    }

    await this.facultyRepository.delete({});
    await this.facultyRepository.save(facultiesToSave);
  }
}
