import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';

import { LayoutPage } from '../layout';
import { SchedulePage, ScheduleSettingsPage, NotFoundPage } from '../pages';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      { index: true, element: <SchedulePage /> },
      { path: '/settings', element: <ScheduleSettingsPage /> },
      { path: '/not-found', element: <NotFoundPage /> },
      { path: '*', element: <Navigate to="/not-found" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
