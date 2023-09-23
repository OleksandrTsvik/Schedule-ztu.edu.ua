import { Controller, Get, Post } from '@nestjs/common';

import { ScheduleService } from './schedule.service';

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
