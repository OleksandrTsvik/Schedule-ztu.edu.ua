import { RouteObject, createBrowserRouter } from 'react-router-dom';

import LayoutPage from '../layout/LayoutPage';
import SchedulePage from '../pages/SchedulePage';
import SettingsPage from '../pages/SettingsPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      { index: true, element: <SchedulePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
