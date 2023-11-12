import {
  ToastProviderProps,
  UseToastOptions,
  createStandaloneToast,
} from '@chakra-ui/react';

import theme from './theme';

const defaultOptions: UseToastOptions = { position: 'bottom-right' };

export const toastOptions: ToastProviderProps = {
  defaultOptions,
};

export const { ToastContainer, toast } = createStandaloneToast({
  theme,
  defaultOptions,
});
