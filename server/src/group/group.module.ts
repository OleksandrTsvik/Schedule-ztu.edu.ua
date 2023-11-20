import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacultyEntity } from './faculty.entity';
import { GroupEntity } from './group.entity';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyEntity, GroupEntity])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
