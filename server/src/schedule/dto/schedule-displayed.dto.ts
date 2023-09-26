export class ScheduleDisplayedDto {
  schedule: ScheduleDisplayed;
  scheduleWeekday: number;
  scheduleWeek: number;
  errors: string[];

  constructor() {
    this.schedule = [];
    this.scheduleWeekday = -1;
    this.scheduleWeek = -1;
    this.errors = [];
  }
}

export type ScheduleDisplayed = ScheduleDisplayedItem[];

export type ScheduleDisplayedItem = {
  [key: string]: (SubjectDisplayed | null)[];
};

export class SubjectDisplayed {
  id: string;
  week: number;
  weekday: number;
  time: string;
  subject: string;
  classroom: string;
  teachers: string[];
  groups: string[];
  cabinetContent?: string;
}
