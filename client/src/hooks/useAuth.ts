import { useMemo } from 'react';

import { selectAuthState } from '../auth/auth.slice';
import { useAppSelector } from './store';

export default function useAuth() {
  const auth = useAppSelector(selectAuthState);

  return useMemo(() => auth, [auth]);
}
