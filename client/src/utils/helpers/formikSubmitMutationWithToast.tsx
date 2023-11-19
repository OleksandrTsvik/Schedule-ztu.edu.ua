import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  MutationDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import { FormikHelpers } from 'formik';
import { ToastPosition } from '@chakra-ui/react';

import { ErrorMessage } from '../../components';
import { toast } from '../chakra/toast';
import getErrorObject from './getErrorObject';

type MutationFunc<QueryArg, ResultType> = MutationTrigger<
  MutationDefinition<
    QueryArg,
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      object,
      FetchBaseQueryMeta
    >,
    string,
    ResultType,
    string
  >
>;

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
    try {
      const data = await handleSubmit(values).unwrap();

      if (afterSubmit) {
        await Promise.resolve(afterSubmit(data));
      }

      if (showToastSuccess) {
        toast({
          status: 'success',
          title: successMessage,
          position,
        });
      }
    } catch (error) {
      const errorObject = getErrorObject(error);

      if (showToastError) {
        toast({
          status: 'error',
          title: errorMessage || errorObject.message,
          description: <ErrorMessage message={errorObject.description} />,
          isClosable: true,
          duration: 30000,
          position,
        });
      }
    }
  };
}
