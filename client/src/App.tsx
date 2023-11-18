import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import theme from './utils/chakra/theme';
import { ToastContainer, toastOptions } from './utils/chakra/toast';
import { store } from './store/store';
import AuthMiddleware from './auth/AuthMiddleware';
import { router } from './router/Routes';

export default function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme} toastOptions={toastOptions}>
        <AuthMiddleware>
          <RouterProvider router={router} />
        </AuthMiddleware>
      </ChakraProvider>
      <ToastContainer />
    </Provider>
  );
}
