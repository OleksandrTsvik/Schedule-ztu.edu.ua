import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import configuration from 'src/config/configuration';
import { MS_PER_DAY } from 'src/common/constants/settings';
// import parsingSchedule from 'src/common/parsing/schedule.parsing';
import parsingScheduleCabinet from 'src/common/parsing/schedule-cabinet.parsing';
import CabinetSubject from 'src/common/interfaces/cabinet-subject.interface';
import { ScheduleSettingsService } from 'src/schedule-settings/schedule-settings.service';
import {
  ScheduleDisplayed,
  ScheduleDisplayedDto,
} from './dto/schedule-displayed.dto';
import { ScheduleEntity } from './schedule.entity';
import Result from 'src/common/utils/result.util';
import ConfigProps from 'src/config/config.interface';
import { ScheduleSettingsEntity } from 'src/schedule-settings/schedule-settings.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly scheduleSettingsService: ScheduleSettingsService,
  ) {}

  getSchedule(): Promise<ScheduleEntity[]> {
    return this.scheduleRepository.find();
  }

  async getScheduleDisplayed(): Promise<ScheduleDisplayedDto> {
    const scheduleShown = await this.scheduleRepository.find({
      where: { show: true },
    });

    const scheduleSettings =
      await this.scheduleSettingsService.getFirstScheduleSettings();

    if (!scheduleSettings) {
      throw new BadRequestException('No schedule settings');
    }

    const errors: string[] = [];
    const sortedScheduleDisplayed: ScheduleDisplayed[][][] = [];

    const { times, countWeek, countDay, currentWeekday, currentWeek } =
      this.calculateDates(
        scheduleShown,
        scheduleSettings.dateFirstWeekSchedule,
      );

    const config = configuration();
    let cabinetSubjects: CabinetSubject[] | undefined;

    if (currentWeekday <= countDay) {
      const cabinetSubjectsResult = await this.getCabinetSubjects(
        config,
        scheduleSettings,
      );

      if (cabinetSubjectsResult.isSuccess) {
        cabinetSubjects = cabinetSubjectsResult.value;
      } else if (cabinetSubjectsResult.error) {
        errors.push(cabinetSubjectsResult.error);
      }
    }

    for (let i = 1; i <= countWeek; i++) {
      const week: ScheduleDisplayed[][] = [];

      for (const time of times) {
        const timeRow: ScheduleDisplayed[] = [];

        for (let j = 1; j <= countDay; j++) {
          const subjectFind = scheduleShown.find(
            (scheduleEntity) =>
              scheduleEntity.week === i &&
              scheduleEntity.time === time &&
              scheduleEntity.weekday === j,
          );

          if (!subjectFind) {
            continue;
          }

          const subject: ScheduleDisplayed = { ...subjectFind };

          if (
            subject.week === currentWeek &&
            subject.weekday === currentWeekday
          ) {
            subject.today = true;

            if (cabinetSubjects) {
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

          timeRow.push(subject);
        }

        week.push(timeRow);
      }

      sortedScheduleDisplayed.push(week);
    }

    return {
      schedule: sortedScheduleDisplayed,
      errors,
    };
  }

  // async updateSchedule() {
  //   const config = configuration();

  //   const schedule = await parsingSchedule(config.links.schedulePage + '/ІПЗ-20-3');
  // }

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
    dateFirstWeekSchedule: Date,
  ) {
    const times = [
      ...new Set(scheduleShown.map((scheduleEntity) => scheduleEntity.time)),
    ];

    // const times = scheduleDisplayed.reduce(
    //   (times, scheduleEntity) =>
    //     times.includes(scheduleEntity.time)
    //       ? times
    //       : [...times, scheduleEntity.time],
    //   [] as string[],
    // );

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

    let currentWeek = numberWeek % countWeek;

    if (currentWeek === 0) {
      currentWeek = countWeek;
    }

    if (currentWeekday > countDay) {
      currentWeekday = 1;
      currentWeek = currentWeek >= countWeek ? 1 : currentWeek + 1;
    }

    return {
      times,
      countWeek,
      countDay,
      currentWeekday,
      currentWeek,
    };
  }
}
