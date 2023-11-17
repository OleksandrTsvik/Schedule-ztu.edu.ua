import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';
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

  async getScheduleSettings(
    user: UserEntity,
  ): Promise<ScheduleSettingsEntity | null> {
    const scheduleSettings = await this.scheduleSettingsRepository.findOneBy({
      user: { id: user.id },
    });

    return scheduleSettings;
  }

  async getScheduleSettingsOrFail(
    user: UserEntity,
  ): Promise<ScheduleSettingsEntity> {
    const scheduleSettings = await this.getScheduleSettings(user);

    if (!scheduleSettings) {
      throw new NotFoundException('No schedule settings');
    }

    return scheduleSettings;
  }

  async updateScheduleSettings(
    user: UserEntity,
    updateScheduleSettingsDto: UpdateScheduleSettingsDto,
  ): Promise<ScheduleSettingsEntity> {
    const {
      scheduleForGroup,
      dateFirstWeekSchedule,
      linkToSelectiveSubjects,
      weekForSelectiveSubjects,
      isLoadCabinentContent,
      cabinetLogin,
      cabinetPassword,
    } = updateScheduleSettingsDto;

    let settings = await this.getScheduleSettings(user);

    // if the group is changed, then update the schedule
    const isUpdateSchedule: boolean =
      !settings || settings.scheduleForGroup !== scheduleForGroup;

    if (!settings) {
      settings = this.scheduleSettingsRepository.create({
        ...updateScheduleSettingsDto,
        user,
      });
    } else {
      settings.scheduleForGroup = scheduleForGroup;
      settings.dateFirstWeekSchedule = dateFirstWeekSchedule;
      settings.linkToSelectiveSubjects = linkToSelectiveSubjects;
      settings.weekForSelectiveSubjects = weekForSelectiveSubjects;
      settings.isLoadCabinentContent = isLoadCabinentContent;
      settings.cabinetLogin = cabinetLogin;

      if (cabinetPassword) {
        settings.cabinetPassword = cabinetPassword;
      }
    }

    await this.scheduleSettingsRepository.save(settings);

    // updating the schedule after updating the settings
    if (isUpdateSchedule) {
      await this.scheduleService.clearSchedule(user);
      await this.scheduleService.loadSchedule(user);
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
