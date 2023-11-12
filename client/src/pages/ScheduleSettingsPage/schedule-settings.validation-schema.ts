import * as Yup from 'yup';

import { UpdateScheduleSettingsDto } from '../../models/schedule-settings.interface';

export const scheduleSettingsValidationSchema: Yup.Schema<UpdateScheduleSettingsDto> =
  Yup.object({
    id: Yup.string().required('The id schedule settings is required'),
    scheduleForGroup: Yup.string().required('The group is required'),
    dateFirstWeekSchedule: Yup.string().required(
      'The date first week schedule is required',
    ),
    linkToSelectiveSubjects: Yup.string().optional(),
    weekForSelectiveSubjects: Yup.number()
      .integer()
      .min(1)
      .max(2)
      .required('The week number of the optional subjects is required'),
    isLoadCabinentContent: Yup.boolean().required('This field is required'),
    cabinetLogin: Yup.string().optional(),
    cabinetPassword: Yup.string().optional(),
  });
