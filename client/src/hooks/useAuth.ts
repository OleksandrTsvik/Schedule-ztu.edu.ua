import { useMemo } from 'react';

import { selectCurrentUser } from '../auth/auth.slice';
import { useAppSelector } from './store';

export default function useAuth() {
  const user = useAppSelector(selectCurrentUser);

  return useMemo(() => ({ user }), [user]);
}
