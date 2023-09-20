import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsEntity } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>,
  ) {}

  async getFirstSettings(): Promise<SettingsEntity> {
    const settings = await this.settingsRepository.findOneBy({});

    return settings;
  }

  async updateFirstSettings(
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<SettingsEntity> {
    const {
      scheduleForGroup,
      dateFirstWeekSchedule,
      linkToSelectiveSubjects,
      cabinetLogin,
      cabinetPassword,
    } = updateSettingsDto;

    let settings = await this.getFirstSettings();

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
