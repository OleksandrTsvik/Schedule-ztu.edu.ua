import getErrorObject from '../utils/helpers/getErrorObject';
import { toast } from '../utils/chakra/toast';
import { useLogoutMutation } from '../auth/auth.api';
import { logout as resetAuthState } from '../auth/auth.slice';
import { ErrorMessage } from '../components';
import { useAppDispatch } from './store';
import useAuth from './useAuth';

export default function useLogout() {
  const appDispatch = useAppDispatch();

  const { refreshToken } = useAuth();
  const [logoutMutation] = useLogoutMutation();

  async function logout() {
    try {
      if (refreshToken) {
        await logoutMutation({ refreshToken }).unwrap();
      }

      appDispatch(resetAuthState());
    } catch (error) {
      const errorObject = getErrorObject(error);

      toast({
        status: 'error',
        title: errorObject.message,
        description: <ErrorMessage message={errorObject.description} />,
        isClosable: true,
        duration: 30000,
      });
    }
  }

  return { logout };
}
