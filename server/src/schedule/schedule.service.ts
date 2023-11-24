import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { MS_PER_DAY } from '../common/constants/constants';
import CabinetSubject from '../common/interfaces/cabinet-subject.interface';
import ScheduleSubject from '../common/interfaces/schedule-subject.interface';
import { UserEntity } from '../user/user.entity';
import { ScheduleSettingsService } from '../schedule-settings/schedule-settings.service';
import { ScheduleSettingsEntity } from '../schedule-settings/schedule-settings.entity';
import { ParsingService } from '../parsing/parsing.service';
import {
  SubjectDisplayed,
  ScheduleDisplayedDto,
  ScheduleDisplayedItem,
} from './dto/schedule-displayed.dto';
import { LoadType } from './dto/query-load-schedule.dto';
import { QueryToggleShowSubjectDto } from './dto/query-toggle-show-subject.dto';
import { ToggleShowSubjectDto } from './dto/toggle-show-subject.dto';
import { DisplayPercentage } from './interfaces/display-percentage.interface';
import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    @Inject(forwardRef(() => ScheduleSettingsService))
    private readonly scheduleSettingsService: ScheduleSettingsService,
    private readonly parsingService: ParsingService,
  ) {}

  getSchedule(user: UserEntity): Promise<ScheduleEntity[]> {
    return this.scheduleRepository.findBy({ user: { id: user.id } });
  }

  getScheduleSubjects(user: UserEntity): Promise<ScheduleEntity[]> {
    return this.scheduleRepository.find({
      where: { user: { id: user.id } },
      order: { week: 'ASC', weekday: 'ASC' },
    });
  }

  async toggleShowScheduleSubject(
    user: UserEntity,
    queryToggleShowSubjectDto: QueryToggleShowSubjectDto,
    toggleShowScheduleSubjectDto: ToggleShowSubjectDto,
  ): Promise<void> {
    const { id, subject } = queryToggleShowSubjectDto;
    const { show } = toggleShowScheduleSubjectDto;

    if (!id && !subject) {
      throw new BadRequestException();
    }

    const where: FindOptionsWhere<ScheduleEntity> = { user: { id: user.id } };

    if (id) {
      where.id = id;
    }

    if (subject) {
      where.subject = subject;
    }

    await this.scheduleRepository.update(where, { show });
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
      await this.scheduleSettingsService.getScheduleSettingsOrFail(
        user,
        true,
        true,
      );

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

    let cabinetSubjects: CabinetSubject[] | undefined;

    const { isLoadCabinentContent, cabinetLogin, cabinetPassword } =
      scheduleSettings;

    // if the current day is included in the schedule,
    // then we download the data from the cabinet
    if (isLoadCabinentContent && anySubjectsToday) {
      const { error, value } = await this.parsingService.parsingScheduleCabinet(
        cabinetLogin,
        cabinetPassword,
      );

      if (cabinetSubjects) {
        cabinetSubjects = value;
      } else if (error) {
        scheduleDisplayedDto.errors.push(error);
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
    const scheduleSettings =
      await this.scheduleSettingsService.getScheduleSettingsOrFail(user);

    const {
      scheduleForGroup,
      linkToSelectiveSubjects,
      weekForSelectiveSubjects,
    } = scheduleSettings;

    const lastSchedule = await this.getSchedule(user);

    const { schedule, times } =
      await this.parsingService.parsingScheduleOrFail(scheduleForGroup);

    scheduleSettings.scheduleTimes = times;

    await this.scheduleSettingsService.updateScheduleSettingsEntity(
      scheduleSettings,
    );

    let scheduleGoogleExcel: ScheduleSubject[] = [];

    if (linkToSelectiveSubjects) {
      scheduleGoogleExcel =
        await this.parsingService.parsingScheduleGoogleExcelOrFail(
          linkToSelectiveSubjects,
          weekForSelectiveSubjects,
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
        ? Math.ceil((numberDisplayedSubjects / numberSubjects) * 100)
        : 0;

    return { percentage, numberSubjects, numberDisplayedSubjects };
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
