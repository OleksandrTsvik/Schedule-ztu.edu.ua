import { configureStore } from '@reduxjs/toolkit';

import { NODE_ENV } from '../utils/constants/node-env';
import { scheduleSettingsApi } from '../services/schedule-settings.api';

export const store = configureStore({
  reducer: {
    [scheduleSettingsApi.reducerPath]: scheduleSettingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(scheduleSettingsApi.middleware),
  devTools: NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
