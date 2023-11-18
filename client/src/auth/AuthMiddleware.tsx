import { useLayoutEffect, useState } from 'react';

import { useAppDispatch } from '../hooks/store';
import useAuth from '../hooks/useAuth';
import { useRefreshTokenMutation } from './auth.api';
import { setCredentials } from './auth.slice';
import { Loading } from '../components';

interface Props {
  children: React.ReactNode;
}

export default function AuthMiddleware({ children }: Props) {
  const appDispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const { refreshToken } = useAuth();

  const [refreshTokenMutation] = useRefreshTokenMutation();

  useLayoutEffect(() => {
    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    refreshTokenMutation({ refreshToken })
      .unwrap()
      .then((data) => appDispatch(setCredentials(data)))
      .finally(() => setIsLoading(false));
  }, [refreshToken, refreshTokenMutation, appDispatch]);

  if (isLoading) {
    return <Loading text="Loading app..." />;
  }

  return <>{children}</>;
}
