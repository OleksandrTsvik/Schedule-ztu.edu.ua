import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import ScheduleDisplayedDto from '../models/schedule.interface';
import { baseUrl } from './api';

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
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
