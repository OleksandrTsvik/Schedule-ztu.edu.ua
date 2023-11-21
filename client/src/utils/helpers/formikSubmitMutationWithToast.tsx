import { FormikHelpers } from 'formik';
import { ToastPosition } from '@chakra-ui/react';

import mutationWithToast, { MutationFunc } from './mutationWithToast';

interface Params<T, U> {
  handleSubmit: MutationFunc<T, U>;
  afterSubmit?: (data: Awaited<U>) => void;
  successMessage?: string;
  errorMessage?: string;
  position?: ToastPosition;
  showToastSuccess?: boolean;
  showToastError?: boolean;
}

export default function formikSubmitMutationWithToast<T, U>({
  handleSubmit,
  afterSubmit,
  successMessage = 'The operation was successful',
  errorMessage,
  position = 'bottom-right',
  showToastSuccess = true,
  showToastError = true,
}: Params<T, U>): (values: T, formikBag: FormikHelpers<T>) => Promise<void> {
  return async (values, formikBag) => {
    await mutationWithToast({
      mutation: handleSubmit,
      argument: values,
      afterMutation: afterSubmit,
      successMessage,
      errorMessage,
      position,
      showToastSuccess,
      showToastError,
    });
  };
}
