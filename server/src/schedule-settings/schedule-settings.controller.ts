import { Body, Controller, Get, Put } from '@nestjs/common';

import { UpdateScheduleSettingsDto } from './dto/update-schedule-settings.dto';
import { ScheduleSettingsService } from './schedule-settings.service';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@Controller('schedule-settings')
export class ScheduleSettingsController {
  constructor(private scheduleSettingsService: ScheduleSettingsService) {}

  @Get('/first')
  getFirstScheduleSettings(): Promise<ScheduleSettingsEntity | null> {
    return this.scheduleSettingsService.getFirstScheduleSettings();
  }

  @Put('/first')
  updateFirstScheduleSettings(
    @Body() updateScheduleSettingsDto: UpdateScheduleSettingsDto,
  ): Promise<ScheduleSettingsEntity> {
    return this.scheduleSettingsService.updateFirstScheduleSettings(
      updateScheduleSettingsDto,
    );
  }
}
