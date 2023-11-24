import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import configuration from '../config/configuration';
import Result from '../common/interfaces/result.interface';
import ResultParsingSchedule from '../common/interfaces/result-parsing-schedule.interface';
import ScheduleSubject from '../common/interfaces/schedule-subject.interface';
import CabinetSubject from '../common/interfaces/cabinet-subject.interface';
import ResultParsingGroups from '../common/interfaces/result-parsing-groups.interface';
import getErrorMessage from '../common/utils/get-error-message.util';
import parsingSchedule from '../common/parsing/schedule.parsing';
import parsingScheduleGoogleExcel from '../common/parsing/schedule-google-excel.parsing';
import parsingScheduleCabinet from '../common/parsing/schedule-cabinet.parsing';
import parsingGroups from '../common/parsing/groups.parsing';

@Injectable()
export class ParsingService {
  constructor() {}

  async parsingSchedule(
    scheduleForGroup: string,
  ): Promise<Result<ResultParsingSchedule>> {
    const config = configuration();
    const { schedulePage } = config.links;

    if (!schedulePage) {
      return { error: 'No link to the schedule page.' };
    }

    try {
      const value = await parsingSchedule(
        schedulePage + '/' + scheduleForGroup,
      );

      return { value };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }

  async parsingScheduleOrFail(
    scheduleForGroup: string,
  ): Promise<ResultParsingSchedule> {
    return this.parsingOrFail(() => this.parsingSchedule(scheduleForGroup));
  }

  async parsingScheduleGoogleExcel(
    linkToSelectiveSubjects: string | undefined,
    weekForSelectiveSubjects: number,
  ): Promise<Result<ScheduleSubject[]>> {
    if (!linkToSelectiveSubjects) {
      return { error: 'No link to the google excel.' };
    }

    try {
      const value = await parsingScheduleGoogleExcel(
        linkToSelectiveSubjects,
        weekForSelectiveSubjects,
      );

      return { value };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }

  async parsingScheduleGoogleExcelOrFail(
    linkToSelectiveSubjects: string | undefined,
    weekForSelectiveSubjects: number,
  ): Promise<ScheduleSubject[]> {
    return this.parsingOrFail(() =>
      this.parsingScheduleGoogleExcel(
        linkToSelectiveSubjects,
        weekForSelectiveSubjects,
      ),
    );
  }

  async parsingScheduleCabinet(
    cabinetLogin: string | null,
    cabinetPassword: string | null,
  ): Promise<Result<CabinetSubject[]>> {
    const config = configuration();
    const { loginCabinetPage, scheduleCabinetPage } = config.links;

    if (
      !loginCabinetPage ||
      !scheduleCabinetPage ||
      !cabinetLogin ||
      !cabinetPassword
    ) {
      return { error: 'There are no cabinet settings for parsing.' };
    }

    try {
      const value = await parsingScheduleCabinet(
        loginCabinetPage,
        scheduleCabinetPage,
        cabinetLogin,
        cabinetPassword,
      );

      return { value };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }

  async parsingScheduleCabinetOrFail(
    cabinetLogin: string | null,
    cabinetPassword: string | null,
  ): Promise<CabinetSubject[]> {
    return this.parsingOrFail(() =>
      this.parsingScheduleCabinet(cabinetLogin, cabinetPassword),
    );
  }

  async parsingGroups(): Promise<Result<ResultParsingGroups[]>> {
    const config = configuration();
    const { mainSchedulePage } = config.links;

    if (!mainSchedulePage) {
      return { error: 'No link to the groups schedule.' };
    }

    try {
      const value = await parsingGroups(mainSchedulePage);

      return { value };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }

  async parsingGroupsOrFail(): Promise<ResultParsingGroups[]> {
    return this.parsingOrFail(() => this.parsingGroups());
  }

  private async parsingOrFail<T>(func: () => Promise<Result<T>>): Promise<T> {
    const { error, value } = await func();

    if (error) {
      throw new BadRequestException(error);
    } else if (!value) {
      throw new InternalServerErrorException();
    }

    return value;
  }
}
