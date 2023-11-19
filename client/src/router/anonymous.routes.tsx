import { RouteObject } from 'react-router-dom';

import { LoginPage, RegisterPage } from '../pages';

export const anonymousRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
];
