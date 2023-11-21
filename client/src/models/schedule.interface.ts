export default interface ScheduleDisplayedDto {
  schedule: ScheduleDisplayed;
  scheduleWeekday: number;
  scheduleWeek: number;
  errors: string[];
}

export interface SubjectDisplayed {
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

export type ScheduleDisplayedItem = {
  [key: string]: (SubjectDisplayed[] | null)[];
};

export type ScheduleDisplayed = ScheduleDisplayedItem[];

export interface DisplayPercentage {
  percentage: number;
  numberSubjects: number;
  numberDisplayedSubjects: number;
}
