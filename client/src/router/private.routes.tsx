import { RouteObject } from 'react-router-dom';

import {
  DisplaySettingsPage,
  SchedulePage,
  ScheduleSettingsPage,
  ShowedSubjectsPage,
  UpdateSchedulePage,
} from '../pages';

export const privateRoutes: RouteObject[] = [
  { index: true, element: <SchedulePage /> },
  { path: 'settings', element: <ScheduleSettingsPage /> },
  {
    path: 'display-settings',
    element: <DisplaySettingsPage />,
    children: [
      { index: true, element: <UpdateSchedulePage /> },
      { path: 'update', element: <UpdateSchedulePage /> },
      { path: 'showed', element: <ShowedSubjectsPage /> },
    ],
  },
];
