export default interface ScheduleSettings {
  id: string;
  scheduleForGroup: string;
  dateFirstWeekSchedule: Date;
  linkToSelectiveSubjects?: string;
  weekForSelectiveSubjects: number;
  isLoadCabinentContent: boolean;
  cabinetLogin?: string;
}
