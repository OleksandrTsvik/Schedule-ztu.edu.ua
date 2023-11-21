import mutationWithToast from '../utils/helpers/mutationWithToast';
import { useLogoutMutation } from '../auth/auth.api';
import { logout as resetAuthState } from '../auth/auth.slice';
import { useAppDispatch } from './store';
import useAuth from './useAuth';

export default function useLogout() {
  const appDispatch = useAppDispatch();

  const { refreshToken } = useAuth();
  const [logoutMutation] = useLogoutMutation();

  async function logout() {
    if (refreshToken) {
      await mutationWithToast({
        mutation: logoutMutation,
        argument: { refreshToken },
        afterMutation: () => appDispatch(resetAuthState()),
      });
    } else {
      appDispatch(resetAuthState());
    }
  }

  return { logout };
}
