import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { LOCAL_STORAGE_REFRESH_TOKEN } from '../utils/constants/constants';
import User from '../models/user.interface';
import { RootState } from '../store/store';

interface CredentialsPayload {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN),
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setCredentials: (state, { payload }: PayloadAction<CredentialsPayload>) => {
      const { user, accessToken, refreshToken } = payload;

      state.user = user;
      state.accessToken = accessToken;

      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, refreshToken);
      }
    },
    setAccessToken: (
      state,
      { payload }: PayloadAction<{ accessToken: string }>,
    ) => {
      state.accessToken = payload.accessToken;
    },
    setRefreshToken: (
      state,
      { payload }: PayloadAction<{ refreshToken: string }>,
    ) => {
      state.refreshToken = payload.refreshToken;
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
    },
  },
});

export const authReducer = authSlice.reducer;

export const { setCredentials, setAccessToken, setRefreshToken, logout } =
  authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
