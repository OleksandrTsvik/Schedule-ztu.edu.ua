import { Controller, Get, Post } from '@nestjs/common';

import { FacultyEntity } from './faculty.entity';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  getAllFacultiesWithGroups(): Promise<FacultyEntity[]> {
    return this.groupService.getAllFacultiesWithGroups();
  }

  @Post('load')
  loadFacultiesAndGroups(): Promise<void> {
    return this.groupService.loadFacultiesAndGroups();
  }
}
