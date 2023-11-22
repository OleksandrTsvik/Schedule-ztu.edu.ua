import { RouteObject } from 'react-router-dom';

import {
  DisplaySettingsPage,
  SchedulePage,
  ScheduleSettingsPage,
  ShowedSubjectsPage,
  DownloadSchedulePage,
} from '../pages';

export const privateRoutes: RouteObject[] = [
  { index: true, element: <SchedulePage /> },
  { path: 'settings', element: <ScheduleSettingsPage /> },
  {
    path: 'display-settings',
    element: <DisplaySettingsPage />,
    children: [
      { index: true, element: <DownloadSchedulePage /> },
      { path: 'download', element: <DownloadSchedulePage /> },
      { path: 'showed', element: <ShowedSubjectsPage /> },
    ],
  },
];
