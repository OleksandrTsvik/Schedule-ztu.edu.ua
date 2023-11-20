import { configureStore } from '@reduxjs/toolkit';

import { NODE_ENV } from '../utils/constants/node-env';
import { authReducer } from '../auth/auth.slice';
import { authApi } from '../auth/auth.api';
import { scheduleSettingsApi } from '../services/schedule-settings.api';
import { scheduleApi } from '../services/schedule.api';
import { groupApi } from '../services/group.api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [scheduleSettingsApi.reducerPath]: scheduleSettingsApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      scheduleSettingsApi.middleware,
      scheduleApi.middleware,
      groupApi.middleware,
    ),
  devTools: NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
