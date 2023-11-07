import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ScheduleService } from '../schedule/schedule.service';
import { UpdateScheduleSettingsDto } from './dto/update-schedule-settings.dto';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@Injectable()
export class ScheduleSettingsService {
  constructor(
    @InjectRepository(ScheduleSettingsEntity)
    private readonly scheduleSettingsRepository: Repository<ScheduleSettingsEntity>,
    @Inject(forwardRef(() => ScheduleService))
    private readonly scheduleService: ScheduleService,
  ) {}

  getFirstScheduleSettings(): Promise<ScheduleSettingsEntity | null> {
    return this.scheduleSettingsRepository.findOneBy({});
  }

  async getScheduleSettings(): Promise<ScheduleSettingsEntity> {
    const scheduleSettings = await this.getFirstScheduleSettings();

    if (!scheduleSettings) {
      throw new BadRequestException('No schedule settings');
    }

    return scheduleSettings;
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
    const isUpdateSchedule: boolean =
      !settings || settings.scheduleForGroup !== scheduleForGroup;

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

    // updating the schedule after updating the settings
    if (isUpdateSchedule) {
      await this.scheduleService.clearSchedule();
      await this.scheduleService.loadSchedule();
    }

    return settings;
  }

  async updateScheduleSettingsEntity(scheduleSettings: ScheduleSettingsEntity) {
    await this.scheduleSettingsRepository.update(
      { id: scheduleSettings.id },
      scheduleSettings,
    );
  }
}
