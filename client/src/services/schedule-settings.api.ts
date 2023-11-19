import { createApi } from '@reduxjs/toolkit/query/react';

import ScheduleSettings, {
  UpdateScheduleSettingsDto,
} from '../models/schedule-settings.interface';
import { baseQueryWithReauth } from '../auth/baseQueryWithReauth';

export const scheduleSettingsApi = createApi({
  reducerPath: 'scheduleSettingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getScheduleSettings: builder.query<ScheduleSettings, void>({
      query: () => ({
        url: '/schedule-settings',
      }),
      providesTags: ['Settings'],
    }),
    updateScheduleSettings: builder.mutation<
      ScheduleSettings,
      UpdateScheduleSettingsDto
    >({
      query: (data) => ({
        url: '/schedule-settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetScheduleSettingsQuery,
  useUpdateScheduleSettingsMutation,
} = scheduleSettingsApi;
