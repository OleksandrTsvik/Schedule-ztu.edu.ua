import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import configuration from 'src/config/configuration';
import ConfigProps from 'src/config/config.interface';
import { MS_PER_DAY } from 'src/common/constants/settings';
import parsingSchedule from 'src/common/parsing/schedule.parsing';
import parsingScheduleGoogleExcel from 'src/common/parsing/schedule-google-excel.parsing';
import parsingScheduleCabinet from 'src/common/parsing/schedule-cabinet.parsing';
import CabinetSubject from 'src/common/interfaces/cabinet-subject.interface';
import ScheduleSubject from 'src/common/interfaces/schedule-subject.interface';
import Result from 'src/common/utils/result.util';
import { ScheduleSettingsService } from 'src/schedule-settings/schedule-settings.service';
import { ScheduleSettingsEntity } from 'src/schedule-settings/schedule-settings.entity';
import {
  SubjectDisplayed,
  ScheduleDisplayedDto,
  ScheduleDisplayedItem,
} from './dto/schedule-displayed.dto';
import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    @Inject(forwardRef(() => ScheduleSettingsService))
    private readonly scheduleSettingsService: ScheduleSettingsService,
  ) {}

  getSchedule(): Promise<ScheduleEntity[]> {
    return this.scheduleRepository.find();
  }

  async clearSchedule(): Promise<void> {
    await this.scheduleRepository.delete({});
  }

  async getScheduleDisplayed(): Promise<ScheduleDisplayedDto> {
    const scheduleShown = await this.scheduleRepository.find({
      where: { show: true },
    });

    const scheduleDisplayedDto = new ScheduleDisplayedDto();

    if (scheduleShown.length === 0) {
      return scheduleDisplayedDto;
    }

    const scheduleSettings = await this.getScheduleSettings();

    const {
      times,
      countWeek,
      countDay,
      currentWeekday,
      scheduleWeekday,
      scheduleWeek,
    } = this.calculateDates(scheduleShown, scheduleSettings);

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
          const subjectFind = scheduleShown.find(
            (scheduleEntity) =>
              scheduleEntity.week === i &&
              scheduleEntity.time === time &&
              scheduleEntity.weekday === j,
          );

          if (!subjectFind) {
            week[time].push(null);

            continue;
          }

          const subject: SubjectDisplayed = { ...subjectFind };

          if (
            subject.week === scheduleWeek &&
            subject.weekday === scheduleWeekday
          ) {
            subject.active = true;

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

          week[time].push(subject);
        }
      }

      scheduleDisplayedDto.schedule.push(week);
    }

    return scheduleDisplayedDto;
  }

  async loadSchedule() {
    const config = configuration();
    const scheduleSettings = await this.getScheduleSettings();
    const lastSchedule = await this.getSchedule();

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
        lastSchedule.length === 0 ||
        lastSchedule.some(
          (scheduleEntity) =>
            scheduleEntity.show &&
            scheduleEntity.week === subject.week &&
            scheduleEntity.weekday === subject.weekday &&
            scheduleEntity.time === subject.time &&
            scheduleEntity.subject === subject.subject &&
            scheduleEntity.classroom === subject.classroom &&
            scheduleEntity.teachers.every((teacher) =>
              subject.teachers.includes(teacher),
            ) &&
            scheduleEntity.groups.every((group) =>
              subject.groups.includes(group),
            ),
        );

      subjectsToSave.push({
        ...subject,
        show,
      });
    }

    await this.clearSchedule();
    await this.scheduleRepository.save(subjectsToSave);
  }

  private async getScheduleSettings(): Promise<ScheduleSettingsEntity> {
    const scheduleSettings =
      await this.scheduleSettingsService.getFirstScheduleSettings();

    if (!scheduleSettings) {
      throw new BadRequestException('No schedule settings');
    }

    return scheduleSettings;
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

    // const times = [
    //   ...new Set(scheduleShown.map((scheduleEntity) => scheduleEntity.time)),
    // ];

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
}
