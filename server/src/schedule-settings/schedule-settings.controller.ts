import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';

import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { UpdateScheduleSettingsDto } from './dto/update-schedule-settings.dto';
import { ScheduleSettingsService } from './schedule-settings.service';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@UseGuards(AuthJwtGuard)
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
