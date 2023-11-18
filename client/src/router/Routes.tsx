import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';

import { LayoutPage } from '../layout';
import {
  SchedulePage,
  ScheduleSettingsPage,
  NotFoundPage,
  LoginPage,
} from '../pages';
import PrivateOutlet from './PrivateOutlet';
import AnonymousOutlet from './AnonymousOutlet';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      {
        element: <PrivateOutlet />,
        children: [
          { index: true, element: <SchedulePage /> },
          { path: '/settings', element: <ScheduleSettingsPage /> },
        ],
      },
      {
        element: <AnonymousOutlet />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <LoginPage /> },
        ],
      },
      { path: '/not-found', element: <NotFoundPage /> },
      { path: '*', element: <Navigate to="/not-found" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
