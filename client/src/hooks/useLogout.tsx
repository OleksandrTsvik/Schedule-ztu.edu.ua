import mutationWithToast from '../utils/helpers/mutationWithToast';
import { authApi, useLogoutMutation } from '../auth/auth.api';
import { groupApi } from '../services/group.api';
import { scheduleSettingsApi } from '../services/schedule-settings.api';
import { scheduleApi } from '../services/schedule.api';
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

    [authApi, scheduleSettingsApi, scheduleApi, groupApi].forEach((api) =>
      appDispatch(api.util.resetApiState()),
    );
  }

  return { logout };
}
