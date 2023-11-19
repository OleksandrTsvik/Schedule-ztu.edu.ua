import { createApi } from '@reduxjs/toolkit/query/react';

import User from '../models/user.interface';
import { baseQuery } from './baseQueryWithReauth';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, RefreshTokenRequest>({
      query: (data) => ({
        url: '/auth/logout',
        method: 'POST',
        body: data,
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: '/auth/refreshToken',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
