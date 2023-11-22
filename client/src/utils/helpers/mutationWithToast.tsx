import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  MutationDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import { ToastPosition } from '@chakra-ui/react';

import { toast } from '../chakra/toast';
import toastError from './toastError';

export type MutationFunc<QueryArg, ResultType> = MutationTrigger<
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
  mutation: MutationFunc<T, U>;
  argument: T;
  afterMutation?: (data: Awaited<U>) => void;
  successMessage?: string;
  errorMessage?: string;
  position?: ToastPosition;
  showToastSuccess?: boolean;
  showToastError?: boolean;
}

export default async function mutationWithToast<T, U>({
  mutation,
  argument,
  afterMutation,
  successMessage = 'The operation was successful',
  errorMessage,
  position = 'bottom-right',
  showToastSuccess = false,
  showToastError = true,
}: Params<T, U>): Promise<void> {
  try {
    const data = await mutation(argument).unwrap();

    if (afterMutation) {
      await Promise.resolve(afterMutation(data));
    }

    if (showToastSuccess) {
      toast({
        status: 'success',
        title: successMessage,
        position,
      });
    }
  } catch (error) {
    if (showToastError) {
      toastError({ error, title: errorMessage });
    }
  }
}
