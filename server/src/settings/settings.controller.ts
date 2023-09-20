import { Body, Controller, Get, Put } from '@nestjs/common';

import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';
import { SettingsEntity } from './settings.entity';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('/first')
  getFirstSettings(): Promise<SettingsEntity> {
    return this.settingsService.getFirstSettings();
  }

  @Put('/first')
  updateFirstSettings(
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<SettingsEntity> {
    return this.settingsService.updateFirstSettings(updateSettingsDto);
  }
}
