import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '../auth/baseQueryWithReauth';
import { Faculty } from '../models/group.interface';

export const groupApi = createApi({
  reducerPath: 'groupApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Group'],
  endpoints: (builder) => ({
    getGroups: builder.query<Faculty[], void>({
      query: () => ({
        url: '/group',
      }),
      providesTags: ['Group'],
    }),
    loadGroups: builder.mutation<void, void>({
      query: () => ({
        url: '/group/load',
        method: 'POST',
      }),
      invalidatesTags: ['Group'],
    }),
  }),
});

export const { useGetGroupsQuery, useLoadGroupsMutation } = groupApi;
