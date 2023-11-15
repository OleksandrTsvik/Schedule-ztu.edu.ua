import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { ScheduleService } from './schedule.service';

@UseGuards(AuthJwtGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getSchedule() {
    return this.scheduleService.getScheduleDisplayed();
  }

  @Post()
  loadSchedule() {
    return this.scheduleService.loadSchedule();
  }
}
