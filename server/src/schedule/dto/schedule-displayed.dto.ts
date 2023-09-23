export class ScheduleDisplayedDto {
  schedule: ScheduleDisplayed[][][];
  errors: string[];
}

export class ScheduleDisplayed {
  id: string;
  week: number;
  weekday: number;
  time: string;
  subject: string;
  classroom: string;
  teachers: string[];
  groups: string[];
  today?: boolean;
  cabinetContent?: string;
}
