import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import ScheduleSettings from '../models/schedule-settings.interface';
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
  }),
});

export const { useGetScheduleSettingsQuery } = scheduleSettingsApi;
