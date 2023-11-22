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
import { EncryptionService } from '../encryption/encryption.service';
import { UpdateScheduleSettingsDto } from './dto/update-schedule-settings.dto';
import { ScheduleSettingsEntity } from './schedule-settings.entity';

@Injectable()
export class ScheduleSettingsService {
  constructor(
    @InjectRepository(ScheduleSettingsEntity)
    private readonly scheduleSettingsRepository: Repository<ScheduleSettingsEntity>,
    @Inject(forwardRef(() => ScheduleService))
    private readonly scheduleService: ScheduleService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async getScheduleSettings(
    user: UserEntity,
    decryptCabinetLogin: boolean = false,
    decryptCabinetPassword: boolean = false,
  ): Promise<ScheduleSettingsEntity | null> {
    const scheduleSettings = await this.scheduleSettingsRepository.findOneBy({
      user: { id: user.id },
    });

    if (scheduleSettings && (decryptCabinetLogin || decryptCabinetPassword)) {
      const { decryptedLogin, decryptedPassword } =
        this.decryptCabinetLoginAndPassword(
          scheduleSettings.cabinetLogin,
          scheduleSettings.cabinetPassword,
        );

      if (decryptCabinetLogin) {
        scheduleSettings.cabinetLogin = decryptedLogin;
      }

      if (decryptCabinetPassword) {
        scheduleSettings.cabinetPassword = decryptedPassword;
      }
    }

    return scheduleSettings;
  }

  async getScheduleSettingsOrFail(
    user: UserEntity,
    decryptCabinetLogin: boolean = false,
    decryptCabinetPassword: boolean = false,
  ): Promise<ScheduleSettingsEntity> {
    const scheduleSettings = await this.getScheduleSettings(
      user,
      decryptCabinetLogin,
      decryptCabinetPassword,
    );

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

    const { encryptedLogin, encryptedPassword } =
      this.encryptCabinetLoginAndPassword(cabinetLogin, cabinetPassword);

    let settings = await this.getScheduleSettings(user);

    // if the settings have not yet been created
    // or if the group is changed
    // or changed the links to the selected subjects,
    // then update the schedule
    const isUpdateSchedule: boolean =
      !settings ||
      settings.scheduleForGroup !== scheduleForGroup ||
      settings.linkToSelectiveSubjects !== linkToSelectiveSubjects;

    if (!settings) {
      settings = this.scheduleSettingsRepository.create({
        ...updateScheduleSettingsDto,
        cabinetLogin: encryptedLogin,
        cabinetPassword: encryptedPassword,
        user,
      });
    } else {
      settings.scheduleForGroup = scheduleForGroup;
      settings.dateFirstWeekSchedule = dateFirstWeekSchedule;
      settings.linkToSelectiveSubjects = linkToSelectiveSubjects;
      settings.weekForSelectiveSubjects = weekForSelectiveSubjects;
      settings.isLoadCabinentContent = isLoadCabinentContent;

      settings.cabinetLogin = encryptedLogin;

      if (encryptedPassword) {
        settings.cabinetPassword = encryptedPassword;
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

  encryptCabinetLoginAndPassword(
    login?: string | null,
    password?: string | null,
  ) {
    let encryptedLogin: string | null = null;
    let encryptedPassword: string | null = null;

    if (login) {
      encryptedLogin = this.encryptionService.encryption(login);
    }

    if (password) {
      encryptedPassword = this.encryptionService.encryption(password);
    }

    return { encryptedLogin, encryptedPassword };
  }

  decryptCabinetLoginAndPassword(
    login?: string | null,
    password?: string | null,
  ) {
    let decryptedLogin: string | null = null;
    let decryptedPassword: string | null = null;

    if (login) {
      decryptedLogin = this.encryptionService.decryption(login);
    }

    if (password) {
      decryptedPassword = this.encryptionService.decryption(password);
    }

    return { decryptedLogin, decryptedPassword };
  }
}
