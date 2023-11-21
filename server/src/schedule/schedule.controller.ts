import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from '../common/decorators/get-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { UserEntity } from '../user/user.entity';
import { QueryLoadScheduleDto } from './dto/query-load-schedule.dto';
import { ScheduleDisplayedDto } from './dto/schedule-displayed.dto';
import { ToggleShowScheduleSubjectDto } from './dto/toggle-show-schedule-subject.dto';
import { DisplayPercentage } from './interfaces/display-percentage.interface';
import { ScheduleService } from './schedule.service';
import { ScheduleEntity } from './schedule.entity';

@UseGuards(AtGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getSchedule(@GetUser() user: UserEntity): Promise<ScheduleDisplayedDto> {
    return this.scheduleService.getScheduleDisplayed(user);
  }

  @Post()
  loadSchedule(
    @GetUser() user: UserEntity,
    @Query() queryLoadScheduleDto: QueryLoadScheduleDto,
  ): Promise<void> {
    return this.scheduleService.loadSchedule(
      user,
      queryLoadScheduleDto.loadType,
    );
  }

  @Get('subjects')
  getSubjects(@GetUser() user: UserEntity): Promise<ScheduleEntity[]> {
    return this.scheduleService.getScheduleSubjects(user);
  }

  @Put('subjects')
  toggleShowScheduleSubject(
    @GetUser() user: UserEntity,
    @Body() toggleShowScheduleSubjectDto: ToggleShowScheduleSubjectDto,
  ): Promise<void> {
    return this.scheduleService.toggleShowScheduleSubject(
      user,
      toggleShowScheduleSubjectDto,
    );
  }

  @Get('percentage')
  getDisplayPercentage(
    @GetUser() user: UserEntity,
  ): Promise<DisplayPercentage> {
    return this.scheduleService.getDisplayPercentage(user);
  }
}
