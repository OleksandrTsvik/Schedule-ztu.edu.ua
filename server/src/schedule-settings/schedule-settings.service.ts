import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateScheduleSettingsDto } from './dto/update-schedule-settings.dto';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@Injectable()
export class ScheduleSettingsService {
  constructor(
    @InjectRepository(ScheduleSettingsEntity)
    private readonly scheduleSettingsRepository: Repository<ScheduleSettingsEntity>,
  ) {}

  async getFirstScheduleSettings(): Promise<ScheduleSettingsEntity | null> {
    const settings = await this.scheduleSettingsRepository.findOneBy({});

    return settings;
  }

  async updateFirstScheduleSettings(
    updateScheduleSettingsDto: UpdateScheduleSettingsDto,
  ): Promise<ScheduleSettingsEntity> {
    const {
      scheduleForGroup,
      dateFirstWeekSchedule,
      linkToSelectiveSubjects,
      cabinetLogin,
      cabinetPassword,
    } = updateScheduleSettingsDto;

    let settings = await this.getFirstScheduleSettings();

    // if the group is changed, then update the schedule
    if (!settings || settings.scheduleForGroup !== scheduleForGroup) {
      // TODO
    }

    if (!settings) {
      settings = this.scheduleSettingsRepository.create({
        ...updateScheduleSettingsDto,
      });
    } else {
      settings.scheduleForGroup = scheduleForGroup;
      settings.dateFirstWeekSchedule = dateFirstWeekSchedule;
      settings.linkToSelectiveSubjects = linkToSelectiveSubjects;
      settings.cabinetLogin = cabinetLogin;

      if (cabinetPassword) {
        settings.cabinetPassword = cabinetPassword;
      }
    }

    await this.scheduleSettingsRepository.save(settings);

    return settings;
  }
}
