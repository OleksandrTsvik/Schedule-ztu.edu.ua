import { Controller, Get } from '@nestjs/common';

import configuration from 'src/config/configuration';
import parsingSchedule from 'src/common/parsing/schedule.parsing';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getSchedule() {
    const config = configuration();

    if (config.links.schedulePage) {
      return parsingSchedule(config.links.schedulePage + '/ІПЗ-20-3');
    }
  }
}
