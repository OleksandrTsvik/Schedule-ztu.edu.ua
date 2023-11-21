import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { GetUser } from '../common/decorators/get-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { UserEntity } from '../user/user.entity';
import { QueryLoadScheduleDto } from './dto/query-load-schedule.dto';
import { ScheduleService } from './schedule.service';

@UseGuards(AtGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getSchedule(@GetUser() user: UserEntity) {
    return this.scheduleService.getScheduleDisplayed(user);
  }

  @Post()
  loadSchedule(
    @GetUser() user: UserEntity,
    @Query() queryLoadScheduleDto: QueryLoadScheduleDto,
  ) {
    return this.scheduleService.loadSchedule(
      user,
      queryLoadScheduleDto.loadType,
    );
  }

  @Get('percentage')
  getDisplayPercentage(@GetUser() user: UserEntity) {
    return this.scheduleService.getDisplayPercentage(user);
  }
}
