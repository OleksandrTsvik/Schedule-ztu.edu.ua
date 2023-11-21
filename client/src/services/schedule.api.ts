import { createApi } from '@reduxjs/toolkit/query/react';

import ScheduleDisplayedDto, {
  DisplayPercentage,
} from '../models/schedule.interface';
import { baseQueryWithReauth } from '../auth/baseQueryWithReauth';

export enum LoadType {
  FULLY = 'FULLY',
  DEFAULT = 'DEFAULT',
}

export interface LoadScheduleRequest {
  loadType: LoadType;
}

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
    getDisplayPercentage: builder.query<DisplayPercentage, void>({
      query: () => ({
        url: '/schedule/percentage',
      }),
      providesTags: ['Schedule'],
    }),
    loadSchedule: builder.mutation<void, LoadScheduleRequest>({
      query: (data) => ({
        url: '/schedule',
        method: 'POST',
        params: data,
      }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

export const {
  useGetScheduleQuery,
  useGetDisplayPercentageQuery,
  useLoadScheduleMutation,
} = scheduleApi;
