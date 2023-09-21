import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateScheduleSettingsDto } from './dto/update-schedule-settings.dto';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@Injectable()
export class ScheduleSettingsService {
  constructor(
    @InjectRepository(ScheduleSettingsEntity)
    private readonly settingsRepository: Repository<ScheduleSettingsEntity>,
  ) {}

  async getFirstSettings(): Promise<ScheduleSettingsEntity> {
    const settings = await this.settingsRepository.findOneBy({});

    return settings;
  }

  async updateFirstSettings(
    updateSettingsDto: UpdateScheduleSettingsDto,
  ): Promise<ScheduleSettingsEntity> {
    const {
      scheduleForGroup,
      dateFirstWeekSchedule,
      linkToSelectiveSubjects,
      cabinetLogin,
      cabinetPassword,
    } = updateSettingsDto;

    let settings = await this.getFirstSettings();

    // if the group is changed, then update the schedule
    if (!settings || settings.scheduleForGroup !== scheduleForGroup) {
      // TODO
    }

    if (!settings) {
      settings = this.settingsRepository.create({ ...updateSettingsDto });
    } else {
      settings.scheduleForGroup = scheduleForGroup;
      settings.dateFirstWeekSchedule = dateFirstWeekSchedule;
      settings.linkToSelectiveSubjects = linkToSelectiveSubjects;
      settings.cabinetLogin = cabinetLogin;

      if (cabinetPassword) {
        settings.cabinetPassword = cabinetPassword;
      }
    }

    await this.settingsRepository.save(settings);

    return settings;
  }
}
