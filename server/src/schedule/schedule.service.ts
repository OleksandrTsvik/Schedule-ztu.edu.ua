import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MS_PER_DAY } from '../common/constants/constants';
import parsingSchedule from '../common/parsing/schedule.parsing';
import parsingScheduleGoogleExcel from '../common/parsing/schedule-google-excel.parsing';
import parsingScheduleCabinet from '../common/parsing/schedule-cabinet.parsing';
import CabinetSubject from '../common/interfaces/cabinet-subject.interface';
import ScheduleSubject from '../common/interfaces/schedule-subject.interface';
import Result from '../common/utils/result.util';
import configuration from '../config/configuration';
import ConfigProps from '../config/config.interface';
import { UserEntity } from '../user/user.entity';
import { ScheduleSettingsService } from '../schedule-settings/schedule-settings.service';
import { ScheduleSettingsEntity } from '../schedule-settings/schedule-settings.entity';
import {
  SubjectDisplayed,
  ScheduleDisplayedDto,
  ScheduleDisplayedItem,
} from './dto/schedule-displayed.dto';
import { LoadType } from './dto/query-load-schedule.dto';
import { DisplayPercentage } from './interfaces/display-percentage.interface';
import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    @Inject(forwardRef(() => ScheduleSettingsService))
    private readonly scheduleSettingsService: ScheduleSettingsService,
  ) {}

  getSchedule(user: UserEntity): Promise<ScheduleEntity[]> {
    return this.scheduleRepository.findBy({ user: { id: user.id } });
  }

  async clearSchedule(user: UserEntity): Promise<void> {
    await this.scheduleRepository.delete({ user: { id: user.id } });
  }

  async getScheduleDisplayed(user: UserEntity): Promise<ScheduleDisplayedDto> {
    const scheduleShown = await this.scheduleRepository.find({
      where: { show: true, user: { id: user.id } },
    });

    const scheduleDisplayedDto = new ScheduleDisplayedDto();

    if (scheduleShown.length === 0) {
      return scheduleDisplayedDto;
    }

    const scheduleSettings =
      await this.scheduleSettingsService.getScheduleSettingsOrFail(user);

    const {
      times,
      countWeek,
      countDay,
      currentWeekday,
      scheduleWeekday,
      scheduleWeek,
    } = this.calculateDates(scheduleShown, scheduleSettings);

    scheduleDisplayedDto.scheduleWeekday = scheduleWeekday;
    scheduleDisplayedDto.scheduleWeek = scheduleWeek;

    const anySubjectsToday = scheduleShown.some(
      (scheduleEntity) =>
        scheduleEntity.show &&
        scheduleEntity.week === scheduleWeek &&
        scheduleEntity.weekday === currentWeekday,
    );

    const config = configuration();
    let cabinetSubjects: CabinetSubject[] | undefined;

    // if the current day is included in the schedule,
    // then we download the data from the cabinet
    if (scheduleSettings.isLoadCabinentContent && anySubjectsToday) {
      const cabinetSubjectsResult = await this.getCabinetSubjects(
        config,
        scheduleSettings,
      );

      if (cabinetSubjectsResult.isSuccess) {
        cabinetSubjects = cabinetSubjectsResult.value;
      } else if (cabinetSubjectsResult.error) {
        scheduleDisplayedDto.errors.push(cabinetSubjectsResult.error);
      }
    }

    for (let i = 1; i <= countWeek; i++) {
      const week: ScheduleDisplayedItem = {};

      for (const time of times) {
        week[time] = [];

        for (let j = 1; j <= countDay; j++) {
          const foundSubjects = scheduleShown.filter(
            (scheduleEntity) =>
              scheduleEntity.week === i &&
              scheduleEntity.time === time &&
              scheduleEntity.weekday === j,
          );

          if (foundSubjects.length === 0) {
            week[time].push(null);

            continue;
          }

          const subjects: SubjectDisplayed[] = [...foundSubjects];

          if (cabinetSubjects && scheduleWeek === i && scheduleWeekday === j) {
            this.addCabinetContent(cabinetSubjects, subjects);
          }

          week[time].push(subjects);
        }
      }

      scheduleDisplayedDto.schedule.push(week);
    }

    return scheduleDisplayedDto;
  }

  async loadSchedule(user: UserEntity, loadType?: LoadType) {
    const config = configuration();
    const scheduleSettings =
      await this.scheduleSettingsService.getScheduleSettingsOrFail(user);

    const lastSchedule = await this.getSchedule(user);

    const { schedule, times } = await parsingSchedule(
      config.links.schedulePage + '/' + scheduleSettings.scheduleForGroup,
    );

    scheduleSettings.scheduleTimes = times;

    await this.scheduleSettingsService.updateScheduleSettingsEntity(
      scheduleSettings,
    );

    let scheduleGoogleExcel: ScheduleSubject[] = [];

    if (scheduleSettings.linkToSelectiveSubjects) {
      scheduleGoogleExcel = await parsingScheduleGoogleExcel(
        scheduleSettings.linkToSelectiveSubjects,
        scheduleSettings.weekForSelectiveSubjects,
      );
    }

    const scheduleSubjects: ScheduleSubject[] = [
      ...schedule,
      ...scheduleGoogleExcel,
    ];

    const subjectsToSave: Omit<ScheduleEntity, 'id'>[] = [];

    // we show only the subjects that were shown earlier,
    // and if there were no subjects, we show all of them
    for (const subject of scheduleSubjects) {
      const show =
        loadType === LoadType.FULLY ||
        lastSchedule.length === 0 ||
        lastSchedule.some(this.isSameSubject(subject));

      subjectsToSave.push({
        ...subject,
        show,
        user,
      });
    }

    await this.clearSchedule(user);
    await this.scheduleRepository.save(subjectsToSave);
  }

  async getDisplayPercentage(user: UserEntity): Promise<DisplayPercentage> {
    const numberSubjects = await this.scheduleRepository.countBy({
      user: { id: user.id },
    });

    const numberDisplayedSubjects = await this.scheduleRepository.countBy({
      user: { id: user.id },
      show: true,
    });

    const percentage =
      numberSubjects !== 0
        ? Math.ceil(numberDisplayedSubjects / numberSubjects) * 100
        : 0;

    return { percentage, numberSubjects, numberDisplayedSubjects };
  }

  private async getCabinetSubjects(
    config: ConfigProps,
    scheduleSettings: ScheduleSettingsEntity,
  ): Promise<Result<CabinetSubject[]>> {
    if (
      !config.links.loginCabinetPage ||
      !config.links.scheduleCabinetPage ||
      !scheduleSettings.cabinetLogin ||
      !scheduleSettings.cabinetPassword
    ) {
      return Result.failure('There are no cabinet settings for parsing.');
    }

    try {
      const cabinetSubjects = await parsingScheduleCabinet(
        config.links.loginCabinetPage,
        config.links.scheduleCabinetPage,
        scheduleSettings.cabinetLogin,
        scheduleSettings.cabinetPassword,
      );

      return Result.success(cabinetSubjects);
    } catch (error: any) {
      console.log(error.message);

      return Result.failure(
        'An error occurred while parsing the schedule from the cabinet.',
      );
    }
  }

  private calculateDates(
    scheduleShown: ScheduleEntity[],
    scheduleSettings: ScheduleSettingsEntity,
  ) {
    const dateFirstWeekSchedule = new Date(
      scheduleSettings.dateFirstWeekSchedule,
    );

    const times = scheduleSettings.scheduleTimes;
    // const times = scheduleSettings.scheduleTimes.sort(compareScheduleTimes);

    const countWeek = scheduleShown.reduce((scheduleEntity, current) =>
      scheduleEntity.week > current.week ? scheduleEntity : current,
    ).week;

    const countDay = scheduleShown.reduce((scheduleEntity, current) =>
      scheduleEntity.weekday > current.weekday ? scheduleEntity : current,
    ).weekday;

    const nowDate = new Date();
    const timeDifference = nowDate.getTime() - dateFirstWeekSchedule.getTime();
    const numberWeek = Math.floor(timeDifference / (MS_PER_DAY * 7)) + 1;

    let currentWeekday = nowDate.getDay();

    if (currentWeekday === 0) {
      currentWeekday = 7;
    }

    let scheduleWeek = numberWeek % countWeek;

    if (scheduleWeek === 0) {
      scheduleWeek = countWeek;
    }

    let scheduleWeekday = currentWeekday;

    if (scheduleWeekday > countDay) {
      scheduleWeekday = 1;
      scheduleWeek = scheduleWeek >= countWeek ? 1 : scheduleWeek + 1;
    }

    return {
      times,
      countWeek,
      countDay,
      currentWeekday,
      scheduleWeekday,
      scheduleWeek,
    };
  }

  private addCabinetContent(
    cabinetSubjects: CabinetSubject[],
    subjects: SubjectDisplayed[],
  ): void {
    for (const subject of subjects) {
      const cabinetSubject = cabinetSubjects.find(
        (cabinetSubject) =>
          cabinetSubject.time === subject.time &&
          cabinetSubject.subject === subject.subject,
      );

      if (cabinetSubject) {
        subject.cabinetContent = cabinetSubject.content;
      }
    }
  }

  private isSameSubject(
    subject: ScheduleSubject,
  ): (scheduleEntity: ScheduleEntity) => boolean {
    return (scheduleEntity: ScheduleEntity) =>
      scheduleEntity.show &&
      scheduleEntity.week === subject.week &&
      scheduleEntity.weekday === subject.weekday &&
      scheduleEntity.time === subject.time &&
      scheduleEntity.subject === subject.subject &&
      scheduleEntity.classroom === subject.classroom &&
      scheduleEntity.teachers.every((teacher) =>
        subject.teachers.includes(teacher),
      ) &&
      scheduleEntity.groups.every((group) => subject.groups.includes(group));
  }
}
