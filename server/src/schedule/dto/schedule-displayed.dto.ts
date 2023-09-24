export class ScheduleDisplayedDto {
  schedule: ScheduleDisplayed;
  errors: string[];

  constructor() {
    this.schedule = [];
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
  active?: boolean;
  cabinetContent?: string;
}
