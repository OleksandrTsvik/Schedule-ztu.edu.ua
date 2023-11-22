import { UseToastOptions } from '@chakra-ui/react';

import { ErrorMessage } from '../../components';
import { toast } from '../chakra/toast';
import getErrorObject from './getErrorObject';

interface Params extends UseToastOptions {
  // eslint-disable-next-line
  error: any;
}

export default function toastError({
  error,
  title,
  position = 'bottom-right',
  ...toastOptions
}: Params) {
  const errorObject = getErrorObject(error);

  toast({
    status: 'error',
    title: title || errorObject.message,
    description: <ErrorMessage message={errorObject.description} />,
    isClosable: true,
    duration: 30000,
    position,
    ...toastOptions,
  });
}
