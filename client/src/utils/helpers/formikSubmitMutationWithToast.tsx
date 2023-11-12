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

import { ApiError } from '../../services/api';
import { toast } from '../chakra/toast';
import { ErrorMessage } from '../../components';

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

export default function formikSubmitMutationWithToast<T, U>(
  handleSubmit: MutationFunc<T, U>,
  successMessage = 'Операцію виконано успішно',
  errorMessage?: string,
  position: ToastPosition = 'bottom-right',
): (values: T, formikBag: FormikHelpers<T>) => Promise<void> {
  return async (values, formikBag) => {
    try {
      await handleSubmit(values).unwrap();

      toast({
        status: 'success',
        title: successMessage,
        position,
      });
    } catch (error) {
      const err = error as ApiError;

      toast({
        status: 'error',
        title: errorMessage || err.data.error,
        description: <ErrorMessage error={err} />,
        position,
      });
    }
  };
}
