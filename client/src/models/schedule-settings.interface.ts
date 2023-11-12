export default interface ScheduleSettings {
  id: string;
  scheduleForGroup: string;
  dateFirstWeekSchedule: Date;
  linkToSelectiveSubjects?: string;
  weekForSelectiveSubjects: number;
  isLoadCabinentContent: boolean;
  cabinetLogin?: string;
}

export interface UpdateScheduleSettingsDto {
  id: string;
  scheduleForGroup: string;
  dateFirstWeekSchedule: string;
  linkToSelectiveSubjects?: string;
  weekForSelectiveSubjects: number;
  isLoadCabinentContent: boolean;
  cabinetLogin?: string;
  cabinetPassword?: string;
}
