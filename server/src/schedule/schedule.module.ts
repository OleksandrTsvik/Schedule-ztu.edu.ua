import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleSettingsModule } from 'src/schedule-settings/schedule-settings.module';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleEntity } from './schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleEntity]),
    forwardRef(() => ScheduleSettingsModule),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
