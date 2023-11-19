import { createApi } from '@reduxjs/toolkit/query/react';

import ScheduleDisplayedDto from '../models/schedule.interface';
import { baseQueryWithReauth } from '../auth/baseQueryWithReauth';

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Schedule'],
  endpoints: (builder) => ({
    getSchedule: builder.query<ScheduleDisplayedDto, void>({
      query: () => ({
        url: '/schedule',
      }),
      providesTags: ['Schedule'],
    }),
  }),
});

export const { useGetScheduleQuery } = scheduleApi;
