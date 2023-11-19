import { RouteObject, createBrowserRouter } from 'react-router-dom';

import { LayoutPage } from '../layout';
import { anonymousRoutes } from './anonymous.routes';
import { privateRoutes } from './private.routes';
import { publicRoutes } from './public.routes';
import PrivateOutlet from './PrivateOutlet';
import AnonymousOutlet from './AnonymousOutlet';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      {
        element: <PrivateOutlet />,
        children: privateRoutes,
      },
      {
        element: <AnonymousOutlet />,
        children: anonymousRoutes,
      },
      ...publicRoutes,
    ],
  },
];

export const router = createBrowserRouter(routes);
