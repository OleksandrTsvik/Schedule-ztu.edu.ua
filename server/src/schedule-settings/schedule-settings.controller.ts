import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';

import { GetUser } from '../common/decorators/get-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { UserEntity } from '../user/user.entity';
import { UpdateScheduleSettingsDto } from './dto/update-schedule-settings.dto';
import { ScheduleSettingsService } from './schedule-settings.service';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@UseGuards(AtGuard)
@Controller('schedule-settings')
export class ScheduleSettingsController {
  constructor(private scheduleSettingsService: ScheduleSettingsService) {}

  @Get()
  getScheduleSettings(
    @GetUser() user: UserEntity,
  ): Promise<ScheduleSettingsEntity | null> {
    return this.scheduleSettingsService.getScheduleSettings(user, true);
  }

  @Put()
  updateScheduleSettings(
    @GetUser() user: UserEntity,
    @Body() updateScheduleSettingsDto: UpdateScheduleSettingsDto,
  ): Promise<ScheduleSettingsEntity> {
    return this.scheduleSettingsService.updateScheduleSettings(
      user,
      updateScheduleSettingsDto,
    );
  }
}
