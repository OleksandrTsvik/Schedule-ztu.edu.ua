export interface ScheduleSubject {
  week: number;
  weekday: number;
  time: string;
  subject: string;
  classroom: string;
  teachers: string[];
  groups: string[];
}
