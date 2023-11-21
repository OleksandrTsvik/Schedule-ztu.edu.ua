import { RouteObject, Navigate } from 'react-router-dom';

import { NotFoundPage } from '../pages';

export const publicRoutes: RouteObject[] = [
  { path: 'not-found', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/not-found" replace /> },
];
