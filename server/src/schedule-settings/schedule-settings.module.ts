import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleSettingsController } from './schedule-settings.controller';
import { ScheduleSettingsService } from './schedule-settings.service';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleSettingsEntity])],
  controllers: [ScheduleSettingsController],
  providers: [ScheduleSettingsService],
})
export class ScheduleSettingsModule {}
