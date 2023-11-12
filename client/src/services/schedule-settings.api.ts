import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import ScheduleSettings, {
  UpdateScheduleSettingsDto,
} from '../models/schedule-settings.interface';
import { baseUrl } from './api';

export const scheduleSettingsApi = createApi({
  reducerPath: 'scheduleSettingsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getScheduleSettings: builder.query<ScheduleSettings, void>({
      query: () => ({
        url: '/schedule-settings/first',
      }),
      providesTags: ['Settings'],
    }),
    updateScheduleSettings: builder.mutation<
      ScheduleSettings,
      UpdateScheduleSettingsDto
    >({
      query: (data) => ({
        url: '/schedule-settings/first',
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
