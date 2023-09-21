import { Body, Controller, Get, Put } from '@nestjs/common';

import { UpdateScheduleSettingsDto } from './dto/update-schedule-settings.dto';
import { ScheduleSettingsService } from './schedule-settings.service';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@Controller('schedule-settings')
export class ScheduleSettingsController {
  constructor(private settingsService: ScheduleSettingsService) {}

  @Get('/first')
  getFirstSettings(): Promise<ScheduleSettingsEntity> {
    return this.settingsService.getFirstSettings();
  }

  @Put('/first')
  updateFirstSettings(
    @Body() updateSettingsDto: UpdateScheduleSettingsDto,
  ): Promise<ScheduleSettingsEntity> {
    return this.settingsService.updateFirstSettings(updateSettingsDto);
  }
}
