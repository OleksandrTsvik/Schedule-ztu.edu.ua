import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '../common/decorators/get-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { UserEntity } from '../user/user.entity';
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
  loadSchedule(@GetUser() user: UserEntity) {
    return this.scheduleService.loadSchedule(user);
  }
}
