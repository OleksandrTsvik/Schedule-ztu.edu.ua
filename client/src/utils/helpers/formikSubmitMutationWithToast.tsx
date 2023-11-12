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

export default function formikSubmitMutationWithToast<T, U>(
  handleSubmit: MutationFunc<T, U>,
  successMessage = 'The operation was successful',
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
      const errorObject = getErrorObject(error);

      toast({
        status: 'error',
        title: errorMessage || errorObject.message,
        description: <ErrorMessage message={errorObject.description} />,
        isClosable: true,
        duration: 30000,
        position,
      });
    }
  };
}
