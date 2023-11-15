import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { GetUser } from '../common/decorators/get-user.decorator';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { UserEntity } from '../auth/user.entity';
import { ScheduleService } from './schedule.service';

@UseGuards(AuthJwtGuard)
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
