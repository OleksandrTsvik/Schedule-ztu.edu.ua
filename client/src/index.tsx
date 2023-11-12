import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import theme from './utils/chakra/theme';
import { ToastContainer, toastOptions } from './utils/chakra/toast';
import { store } from './store/store';
import { router } from './router/Routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme} toastOptions={toastOptions}>
        <RouterProvider router={router} />
      </ChakraProvider>
      <ToastContainer />
    </Provider>
  </React.StrictMode>,
);
