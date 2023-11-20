import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import parsingGroups from '../common/parsing/groups.parsing';
import configuration from '../config/configuration';
import { FacultyEntity } from './faculty.entity';
import { GroupEntity } from './group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(FacultyEntity)
    private readonly facultyRepository: Repository<FacultyEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
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
    const config = configuration();

    if (!config.links.mainSchedulePage) {
      throw new NotFoundException('No link to the groups schedule');
    }

    const resultParsing = await parsingGroups(config.links.mainSchedulePage);
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
