import { RouteObject } from 'react-router-dom';

import {
  DisplaySettingsPage,
  SchedulePage,
  ScheduleSettingsPage,
} from '../pages';

export const privateRoutes: RouteObject[] = [
  { index: true, element: <SchedulePage /> },
  { path: '/settings', element: <ScheduleSettingsPage /> },
  { path: '/display-settings', element: <DisplaySettingsPage /> },
];
