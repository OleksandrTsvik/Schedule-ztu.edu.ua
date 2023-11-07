import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleModule } from '../schedule/schedule.module';
import { ScheduleSettingsController } from './schedule-settings.controller';
import { ScheduleSettingsService } from './schedule-settings.service';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleSettingsEntity]),
    forwardRef(() => ScheduleModule),
  ],
  controllers: [ScheduleSettingsController],
  providers: [ScheduleSettingsService],
  exports: [ScheduleSettingsService],
})
export class ScheduleSettingsModule {}
